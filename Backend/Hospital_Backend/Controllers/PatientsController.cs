
using Hospital_Backend.Data;
using Hospital_Backend.DTOs;
using Hospital_Backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace Hospital_Backend.Controllers;

[Route("api/[controller]")]
[ApiController]
public class PatientsController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly PasswordHasher<UserAccount> _passwordHasher = new();

    public PatientsController(ApplicationDbContext context)
    {
        _context = context;
    }

    // Hastaları listele
    [Authorize(Roles = "Staff,Manager")]
    [HttpGet]
    public async Task<IActionResult> GetPatients()
    {
        var patients = await _context.Patient
            .Select(p => new
            {
                p.Id,
                p.FullName,
                p.Age,
                p.Gender,
                p.Phone,
                Email = p.UserAccount != null
                    ? p.UserAccount.Email
                    : null
            })
            .ToListAsync();

        return Ok(patients);
    }

    // Yeni hasta oluştur
    [Authorize(Roles = "Staff,Manager")]
    [HttpPost]
    public async Task<IActionResult> CreatePatient(
        [FromBody] CreatePatientRequest request)
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
                Role = "Patient"
            };

            user.PasswordHash = _passwordHasher.HashPassword(
                user, request.Password);

            _context.UserAccounts.Add(user);
            await _context.SaveChangesAsync();

            var patient = new Patient
            {
                FullName = user.FullName,
                Age = request.Age,
                Gender = request.Gender.Trim(),
                Phone = request.Phone?.Trim(),
                UserAccountId = user.Id
            };

            _context.Patient.Add(patient);
            await _context.SaveChangesAsync();

            await transaction.CommitAsync();

            return StatusCode(201, new
            {
                message = "Hasta başarıyla oluşturuldu.",
                patient.Id,
                patient.FullName,
                patient.Age,
                user.Email,
                user.Role
            });
        }
        catch (DbUpdateException)
        {
            await transaction.RollbackAsync();

            return Conflict(new
            {
                message = "Hasta oluşturulamadı. Bilgileri kontrol edin."
            });
        }
    }

    [Authorize(Roles = "Staff,Manager")]
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdatePatient(
        int id,
        [FromBody] UpdatePatientRequest request)
    {
        var patient = await _context.Patient
            .Include(p => p.UserAccount)
            .SingleOrDefaultAsync(p => p.Id == id);

        if (patient == null)
        {
            return NotFound(new
            {
                message = "Hasta bulunamadı."
            });
        }

        var email = request.Email.Trim().ToLowerInvariant();

        var emailExists = await _context.UserAccounts.AnyAsync(u =>
            u.Email == email &&
            u.Id != patient.UserAccountId);

        if (emailExists)
        {
            return Conflict(new
            {
                message = "Bu e-posta adresi zaten kayıtlı."
            });
        }

        patient.FullName = request.FullName.Trim();
        patient.Age = request.Age;
        patient.Gender = request.Gender.Trim();
        patient.Phone = request.Phone?.Trim();

        if (patient.UserAccount != null)
        {
            patient.UserAccount.FullName = patient.FullName;
            patient.UserAccount.Email = email;
        }

        await _context.SaveChangesAsync();

        return Ok(new
        {
            message = "Hasta bilgileri güncellendi.",
            patient.Id,
            patient.FullName,
            patient.Age,
            patient.Gender,
            patient.Phone,
            Email = patient.UserAccount?.Email
        });
    }

    [Authorize(Roles = "Staff,Manager")]
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeletePatient(int id)
    {
        var patient = await _context.Patient
            .SingleOrDefaultAsync(p => p.Id == id);

        if (patient == null)
        {
            return NotFound(new
            {
                message = "Hasta bulunamadı."
            });
        }

        var userAccountId = patient.UserAccountId;

        await using var transaction =
            await _context.Database.BeginTransactionAsync();

        try
        {
            _context.Patient.Remove(patient);
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
                message = "Hasta başarıyla silindi."
            });
        }
        catch (DbUpdateException)
        {
            await transaction.RollbackAsync();

            return Conflict(new
            {
                message = "Hasta silinemedi. İlişkili kayıtları kontrol edin."
            });
        }
    }

    [Authorize(Roles = "Patient,Staff,Manager")]
    [HttpGet("my-profile")]
    public async Task<IActionResult> GetMyProfile()
    {
        var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);

        if (!int.TryParse(userIdClaim, out var userId))
            return Unauthorized();

        var patient = await _context.Patient
            .FirstOrDefaultAsync(p => p.UserAccountId == userId);

        if (patient == null)
            return NotFound(new { message = "Hasta kaydı bulunamadı." });

        return Ok(new
        {
            patient.Id,
            patient.FullName,
            patient.Age,
            patient.Gender,
            patient.Phone
        });
    }

    [Authorize(Roles = "Patient")]
    [HttpPut("my-profile")]
    public async Task<IActionResult> UpdateMyProfile(
    [FromBody] UpdateMyPatientProfileRequest request)
    {
        var userIdClaim = User.FindFirstValue(
            ClaimTypes.NameIdentifier);

        if (!int.TryParse(userIdClaim, out var userId))
        {
            return Unauthorized(new
            {
                message = "Kullanıcı kimliği doğrulanamadı."
            });
        }

        var patient = await _context.Patient
            .Include(p => p.UserAccount)
            .SingleOrDefaultAsync(p => p.UserAccountId == userId);

        if (patient == null)
        {
            return NotFound(new
            {
                message = "Hasta kaydı bulunamadı."
            });
        }

        if (string.IsNullOrWhiteSpace(request.FullName))
        {
            return BadRequest(new
            {
                message = "Ad soyad alanı zorunludur."
            });
        }

        if (request.Age < 1 || request.Age > 100)
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

        patient.FullName = request.FullName.Trim();
        patient.Age = request.Age;
        patient.Gender = request.Gender.Trim();
        patient.Phone = request.Phone?.Trim();

        if (patient.UserAccount != null)
        {
            patient.UserAccount.FullName = patient.FullName;
        }

        await _context.SaveChangesAsync();

        return Ok(new
        {
            message = "Bilgileriniz başarıyla güncellendi.",
            patient.Id,
            patient.FullName,
            patient.Age,
            patient.Gender,
            patient.Phone
        });
    }

}
