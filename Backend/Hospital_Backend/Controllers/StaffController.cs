
using Hospital_Backend.Data;
using Hospital_Backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;

namespace Hospital_Backend.Controllers;

[Route("api/[controller]")]
[ApiController]
[Authorize(Roles = "Manager")]
public class StaffController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public StaffController(ApplicationDbContext context)
    {
        _context = context;
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
            var user = new UserAccount
            {
                FullName = request.FullName.Trim(),
                Email = email,
                Role = "Staff"
            };

            var passwordHasher = new PasswordHasher<UserAccount>();
            user.PasswordHash = passwordHasher.HashPassword(
                user, request.Password);

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

            return Ok(new
            {
                message = "Personel başarıyla oluşturuldu.",
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
