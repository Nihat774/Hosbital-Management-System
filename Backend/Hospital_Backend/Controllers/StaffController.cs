
using Hospital_Backend.Data;
using Hospital_Backend.Models;
using Hospital_Backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.Security.Cryptography;
using System.Text;

namespace Hospital_Backend.Controllers;

[Route("api/[controller]")]
[ApiController]
[Authorize(Roles = "Manager")]
public class StaffController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly EmailService _emailService;

    public StaffController(ApplicationDbContext context,EmailService emailService)
    {
        _context = context;
        _emailService = emailService;
    }

    // Tüm personelleri listele
    [HttpGet]
    public async Task<IActionResult> GetStaff()
    {
        var staff = await _context.Staff
            .Select(s => new
            {
                s.Id,
                s.FullName,
                s.Email,
                s.Phone,
                s.Gender,
                s.Jobtitle
            })
            .ToListAsync();

        return Ok(staff);
    }

    // Yeni personel ekle
    [HttpPost]
    public async Task<IActionResult> CreateStaff(
        [FromBody] CreateStaffRequest request)
    {
        var email = request.Email.Trim().ToLowerInvariant();

        var emailExists = await _context.UserAccounts
            .AnyAsync(u => u.Email == email);

        if (emailExists)
        {
            return Conflict(new
            {
                message = "Bu e-posta adresi zaten kayıtlı."
            });
        }

        await using var transaction =
            await _context.Database.BeginTransactionAsync();

        try
        {
            var verificationToken = Convert.ToHexString(
     RandomNumberGenerator.GetBytes(32));

            var verificationTokenHash = Convert.ToHexString(
                SHA256.HashData(
                    Encoding.UTF8.GetBytes(verificationToken)));

            var user = new UserAccount
            {
                FullName = request.FullName.Trim(),
                Email = email,
                Role = "Staff",
                IsEmailVerified = false,
                EmailVerificationTokenHash = verificationTokenHash,
                EmailVerificationTokenExpiresAt = DateTime.UtcNow.AddHours(24)
            };

            var passwordHasher = new PasswordHasher<UserAccount>();

            user.PasswordHash = passwordHasher.HashPassword(
                user,
                request.Password);

            _context.UserAccounts.Add(user);
            await _context.SaveChangesAsync();

            var staff = new Staff
            {
                FullName = request.FullName.Trim(),
                Email = email,
                PasswordHash = user.PasswordHash,
                Gender = request.Gender.Trim(),
                Phone = request.Phone?.Trim(),
                Jobtitle = request.Jobtitle?.Trim(),
                UserAccountId = user.Id
            };

            _context.Staff.Add(staff);
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
                    message = "Personel hesabı oluşturuldu ancak doğrulama e-postası gönderilemedi."
                });
            }

            return Ok(new
            {
                message = "Personel başarıyla oluşturuldu, E-postanızı kontrol ediniz.",
                staff.Id,
                staff.FullName,
                staff.Email,
                staff.Jobtitle,
                user.Role
            });
        }
        catch (DbUpdateException)
        {
            await transaction.RollbackAsync();

            return Conflict(new
            {
                message = "Personel oluşturulamadı. Bilgileri kontrol edin."
            });
        }
    }

    public class UpdateStaffRequest
    {
        [Required]
        public string FullName { get; set; } = string.Empty;

        [Required, EmailAddress]
        public string Email { get; set; } = string.Empty;

        [Required]
        public string Gender { get; set; } = string.Empty;

        public string? Phone { get; set; }

        public string? Jobtitle { get; set; }
    }


    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateStaff(
        int id,
        [FromBody] UpdateStaffRequest request)
    {
        var staff = await _context.Staff
            .Include(s => s.UserAccount)
            .SingleOrDefaultAsync(s => s.Id == id);

        if (staff == null)
        {
            return NotFound(new { message = "Personel bulunamadı." });
        }

        var email = request.Email.Trim().ToLowerInvariant();

        var emailExists = await _context.UserAccounts.AnyAsync(u =>
            u.Email == email && u.Id != staff.UserAccountId);

        if (emailExists)
        {
            return Conflict(new
            {
                message = "Bu e-posta adresi zaten kayıtlı."
            });
        }

        staff.FullName = request.FullName.Trim();
        staff.Email = email;
        staff.Gender = request.Gender.Trim();
        staff.Phone = request.Phone?.Trim();
        staff.Jobtitle = request.Jobtitle?.Trim();

        if (staff.UserAccount != null)
        {
            staff.UserAccount.FullName = staff.FullName;
            staff.UserAccount.Email = email;
        }

        await _context.SaveChangesAsync();

        return Ok(new
        {
            message = "Personel bilgileri güncellendi.",
            staff.Id,
            staff.FullName,
            staff.Email,
            staff.Gender,
            staff.Phone,
            staff.Jobtitle
        });
    }



    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteStaff(int id)
    {
        var staff = await _context.Staff
            .SingleOrDefaultAsync(s => s.Id == id);

        if (staff == null)
        {
            return NotFound(new { message = "Personel bulunamadı." });
        }

        var userAccountId = staff.UserAccountId;

        await using var transaction =
            await _context.Database.BeginTransactionAsync();

        try
        {
            _context.Staff.Remove(staff);
            await _context.SaveChangesAsync();

            if (userAccountId.HasValue)
            {
                var user = await _context.UserAccounts
                    .SingleOrDefaultAsync(u => u.Id == userAccountId.Value);

                if (user != null)
                {
                    _context.UserAccounts.Remove(user);
                    await _context.SaveChangesAsync();
                }
            }

            await transaction.CommitAsync();

            return Ok(new
            {
                message = "Personel başarıyla silindi."
            });
        }
        catch (DbUpdateException)
        {
            await transaction.RollbackAsync();

            return Conflict(new
            {
                message = "Personel silinemedi. İlişkili kayıtları kontrol edin."
            });
        }
    }


}

public class CreateStaffRequest
{
    [Required]
    public string FullName { get; set; } = string.Empty;

    [Required]
    [EmailAddress]
    public string Email { get; set; } = string.Empty;

    [Required]
    [MinLength(8)]
    public string Password { get; set; } = string.Empty;

    [Required]
    public string Gender { get; set; } = string.Empty;

    public string? Phone { get; set; }

    public string? Jobtitle { get; set; }
}
