using Hospital_Backend.Data;
using Hospital_Backend.DTOs;
using Hospital_Backend.Models;
using Hospital_Backend.Services;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
namespace Hospital_Backend.Controllers;

[Route("api/[controller]")]
[ApiController]
public class AuthController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly PasswordHasher<UserAccount> _passwordHasher;
    private readonly EmailService _emailService;

    public AuthController(
        ApplicationDbContext context,
        EmailService emailService)
    {
        _context = context;
        _emailService = emailService;
        _passwordHasher = new PasswordHasher<UserAccount>();
    }

    [HttpPost]
    public async Task<IActionResult> Register(RegisterRequest request)
    {
        if (
            string.IsNullOrWhiteSpace(request.FullName) ||
            string.IsNullOrWhiteSpace(request.Email) ||
            string.IsNullOrWhiteSpace(request.Password)
        )
        {
            return BadRequest(new
            {
                message = "Ad soyad, e-posta ve şifre zorunludur."
            });
        }

        if (request.Password.Length < 8)
        {
            return BadRequest(new
            {
                message = "Şifre en az 8 karakter olmalıdır."
            });
        }

        if (request.Age <= 0 || request.Age > 100)
        {
            return BadRequest(new
            {
                message = "Yaş 1 ile 100 arasında olmalıdır."
            });
        }

        if (string.IsNullOrWhiteSpace(request.Gender))
        {
            return BadRequest(new
            {
                message = "Cinsiyet alanı zorunludur."
            });
        }

        var email = request.Email.Trim().ToLowerInvariant();

        var existingUser = await _context.UserAccounts
    .FirstOrDefaultAsync(user => user.Email == email);

        if (existingUser != null)
        {
            if (existingUser.IsEmailVerified)
            {
                return Conflict(new
                {
                    message = "Bu e-posta adresi kayıtlı."
                });
            }

            var verificationToken = Convert.ToHexString(
                RandomNumberGenerator.GetBytes(32));

            var verificationTokenHash = Convert.ToHexString(
                SHA256.HashData(
                    Encoding.UTF8.GetBytes(verificationToken)));

            existingUser.EmailVerificationTokenHash = verificationTokenHash;
            existingUser.EmailVerificationTokenExpiresAt =
                DateTime.UtcNow.AddHours(24);

            await _context.SaveChangesAsync();

            var verificationLink =
                $"http://localhost:3000/verify-email?token={verificationToken}&email={Uri.EscapeDataString(existingUser.Email)}";

            try
            {
                await _emailService.SendVerificationEmailAsync(
                    existingUser.Email,
                    verificationLink);
            }
            catch (Exception)
            {
                return StatusCode(500, new
                {
                    message = "Doğrulama e-postası gönderilemedi. Lütfen tekrar deneyin."
                });
            }

            return Ok(new
            {
                message = "Bu e-posta adresi henüz doğrulanmamış. Yeni doğrulama bağlantısı gönderildi."
            });
        }

        await using var transaction =
            await _context.Database.BeginTransactionAsync();

        try
        {
            var verificationToken = Convert.ToHexString(
             RandomNumberGenerator.GetBytes(32));

            var verificationTokenHash = Convert.ToHexString(
                SHA256.HashData(Encoding.UTF8.GetBytes(verificationToken)));
            var user = new UserAccount
            {
                FullName = request.FullName.Trim(),
                Email = email,
                Role = "Patient",
                IsEmailVerified = false,
                EmailVerificationTokenHash = verificationTokenHash,
                EmailVerificationTokenExpiresAt = DateTime.UtcNow.AddHours(24)
            };

            user.PasswordHash = _passwordHasher.HashPassword(
                user,
                request.Password
            );

            _context.UserAccounts.Add(user);

            // Önce hesabı kaydederek UserAccount.Id değerini alıyoruz.
            await _context.SaveChangesAsync();

            var patient = new Patient
            {
                FullName = user.FullName,
                Age = request.Age,
                UserAccountId = user.Id,
                Phone = request.Phone?.Trim(),
                Gender = request.Gender.Trim()
            };

            _context.Patient.Add(patient);

            await _context.SaveChangesAsync();
            await transaction.CommitAsync();

            var verificationLink =
                $"http://localhost:3000/verify-email?token={verificationToken}&email={Uri.EscapeDataString(user.Email)}";

            try
            {
                await _emailService.SendVerificationEmailAsync(
                    user.Email,
                    verificationLink);
            }
            catch (Exception)
            {
                return StatusCode(500, new
                {
                    message = "Hesap oluşturuldu ancak doğrulama e-postası gönderilemedi. Lütfen daha sonra tekrar deneyin."
                });
            }

            

            return StatusCode(201, new
            {
                message = "Kayıt başarılı.",
                user = new
                {
                    user.Id,
                    user.FullName,
                    user.Email,
                    user.Role
                }
            });
        }
        catch (DbUpdateException)
        {
            await transaction.RollbackAsync();

            return Conflict(new
            {
                message = "Kayıt oluşturulamadı. E-posta adresini kontrol edin."
            });
        }
    }


    [HttpPost("login")]
    public async Task<IActionResult> Login(LoginRequest request) 
    {
        if(string.IsNullOrWhiteSpace(request.Email) || string.IsNullOrWhiteSpace(request.Password)) 
        {
            return BadRequest(new
            { message = "E-posta ve şifre zorunludur." }
            );
        }

        var email = request.Email.Trim().ToLowerInvariant();
        var user = await _context.UserAccounts.SingleOrDefaultAsync(user => user.Email == email);

        if (user == null)
        {
            return Unauthorized(new { message = "E-posta veya şifre hatalı." });
        }

        var verificationResult = _passwordHasher.VerifyHashedPassword(
            user,
            user.PasswordHash,
            request.Password);
        if (verificationResult == PasswordVerificationResult.Failed)
        {
            return Unauthorized(new { message = "E-posta veya şifre hatalı" });
        }

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(
            HttpContext.RequestServices.GetRequiredService<IConfiguration>()["Jwt:Key"]!));

        var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var claims = new[]
{
    new System.Security.Claims.Claim(
        System.Security.Claims.ClaimTypes.NameIdentifier,
        user.Id.ToString()
    ),
    new System.Security.Claims.Claim(
        System.Security.Claims.ClaimTypes.Name,
        user.FullName
    ),
    new System.Security.Claims.Claim(
        System.Security.Claims.ClaimTypes.Role,
        user.Role
    )
};
        if (!user.IsEmailVerified)
        {
            return Unauthorized(new
            {
                message = "Giriş yapmadan önce e-posta adresinizi doğrulayın."
            });
        }
        var token = new System.IdentityModel.Tokens.Jwt.JwtSecurityToken(
            issuer: HttpContext.RequestServices
                .GetRequiredService<IConfiguration>()["Jwt:Issuer"],
            audience: HttpContext.RequestServices
                .GetRequiredService<IConfiguration>()["Jwt:Audience"],
            claims: claims,
            expires: DateTime.UtcNow.AddHours(2),
            signingCredentials: credentials
        );

        var tokenString =
            new System.IdentityModel.Tokens.Jwt.JwtSecurityTokenHandler()
                .WriteToken(token);

        return Ok(new
        {
            message = "Giriş başarılı.",
            token = tokenString,
            user = new
            {
                user.Id,
                user.FullName,
                user.Email,
                user.Role
            }
        });
    }

    [HttpGet("verify-email")]
    public async Task<IActionResult> VerifyEmail(
    [FromQuery] string token,
    [FromQuery] string email)
    {
        if (string.IsNullOrWhiteSpace(token) ||
            string.IsNullOrWhiteSpace(email))
        {
            return BadRequest(new
            {
                message = "Doğrulama bağlantısı geçersiz."
            });
        }

        var normalizedEmail = email.Trim().ToLowerInvariant();

        var user = await _context.UserAccounts
            .FirstOrDefaultAsync(u => u.Email == normalizedEmail);

        if (user == null)
        {
            return BadRequest(new
            {
                message = "Kullanıcı bulunamadı."
            });
        }

        if (user.IsEmailVerified)
        {
            return Ok(new
            {
                message = "E-posta adresiniz doğrulandı."
            });
        }

        if (string.IsNullOrEmpty(user.EmailVerificationTokenHash) ||
            user.EmailVerificationTokenExpiresAt == null ||
            user.EmailVerificationTokenExpiresAt <= DateTime.UtcNow)
        {
            return BadRequest(new
            {
                message = "Doğrulama bağlantısının süresi dolmuş veya bağlantı geçersiz."
            });
        }

        var tokenHash = Convert.ToHexString(
            SHA256.HashData(Encoding.UTF8.GetBytes(token)));

        if (!CryptographicOperations.FixedTimeEquals(
            Convert.FromHexString(tokenHash),
            Convert.FromHexString(user.EmailVerificationTokenHash)))
        {
            return BadRequest(new
            {
                message = "Doğrulama bağlantısı geçersiz."
            });
        }

        user.IsEmailVerified = true;
        user.EmailVerificationTokenHash = null;
        user.EmailVerificationTokenExpiresAt = null;

        await _context.SaveChangesAsync();

        return Ok(new
        {
            message = "E-posta adresiniz başarıyla doğrulandı. Artık giriş yapabilirsiniz."
        });
    }
}


