
using Hospital_Backend.Data;
using Hospital_Backend.DTOs;
using Hospital_Backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Hospital_Backend.Controllers;

[Route("api/[controller]")]
[ApiController]
[Authorize(Roles = "Staff,Manager")]
public class PatientsController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly PasswordHasher<UserAccount> _passwordHasher = new();

    public PatientsController(ApplicationDbContext context)
    {
        _context = context;
    }

    // Hastaları listele
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
}
