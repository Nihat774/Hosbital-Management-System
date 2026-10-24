using Hospital_Backend.Data;
using Hospital_Backend.DTOs;
using Hospital_Backend.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
namespace Hospital_Backend.Controllers;

[Route("api/[controller]")]
[ApiController]
public class AuthController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly PasswordHasher<UserAccount> _passwordHasher;

    public AuthController(ApplicationDbContext context) 
    {
        _context = context;
        _passwordHasher = new PasswordHasher<UserAccount>();
    }
    [HttpPost]

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

        var emailExists = await _context.UserAccounts
            .AnyAsync(user => user.Email == email);

        if (emailExists)
        {
            return Conflict(new
            {
                message = "Bu e-posta adresi kayıtlıdır."
            });
        }

        await using var transaction =
            await _context.Database.BeginTransactionAsync();

        try
        {
            var user = new UserAccount
            {
                FullName = request.FullName.Trim(),
                Email = email,
                Role = "Patient"
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


}


