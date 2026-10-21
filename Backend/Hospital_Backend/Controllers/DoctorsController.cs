
using Hospital_Backend.Data;
using Hospital_Backend.DTOs;
using Hospital_Backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Hospital_Backend.Controllers;

[Route("api/[controller]")]
[ApiController]
public class DoctorsController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public DoctorsController(ApplicationDbContext context)
    {
        _context = context;
    }

    // Herkes doktorları listeleyebilir.
    [AllowAnonymous]
    [HttpGet]
    public async Task<IActionResult> GetDoctors()
    {
        var doctors = await _context.Doctors
            .Select(d => new
            {
                d.Id,
                d.FullName,
                d.Gender,
                d.Phone,
                d.PhotoUrl,
                d.Email,
                d.Specialty,
                d.ExperienceYears,
                d.University,
                d.About,
                d.Languages
            })
            .ToListAsync();

        return Ok(doctors);
    }

    // Herkes doktor detayını görüntüleyebilir.
    [AllowAnonymous]
    [HttpGet("{id}")]
    public async Task<IActionResult> GetDoctor(int id)
    {
        var doctor = await _context.Doctors
            .Where(d => d.Id == id)
            .Select(d => new
            {
                d.Id,
                d.FullName,
                d.Gender,
                d.Phone,
                d.PhotoUrl,
                d.Email,
                d.Specialty,
                d.ExperienceYears,
                d.University,
                d.About,
                d.Languages
            })
            .FirstOrDefaultAsync();

        if (doctor == null)
        {
            return NotFound(new
            {
                message = "Doktor bulunamadı."
            });
        }

        return Ok(doctor);
    }

    // Yalnızca müdür doktor ekleyebilir.
    [Authorize(Roles = "Manager")]
    [HttpPost]
    public async Task<IActionResult> CreateDoctor(
        [FromBody] DoctorRequest request)
    {
        var email = request.Email.Trim().ToLowerInvariant();

        var emailExists = await _context.Doctors
            .AnyAsync(d => d.Email == email);

        if (emailExists)
        {
            return Conflict(new
            {
                message = "Bu e-posta adresiyle kayıtlı bir doktor var."
            });
        }

        var doctor = new Doctor
        {
            FullName = request.FullName.Trim(),
            Email = email,
            Gender = request.Gender.Trim(),
            Phone = request.Phone,
            PhotoUrl = request.PhotoUrl,
            Specialty = request.Specialty.Trim(),
            ExperienceYears = request.ExperienceYears,
            University = request.University.Trim(),
            About = request.About,
            Languages = request.Languages
        };

        _context.Doctors.Add(doctor);
        await _context.SaveChangesAsync();

        return CreatedAtAction(
            nameof(GetDoctor),
            new { id = doctor.Id },
            new
            {
                doctor.Id,
                doctor.FullName,
                doctor.Email,
                doctor.Specialty
            });
    }

    // Yalnızca müdür doktor bilgilerini güncelleyebilir.
    [Authorize(Roles = "Manager")]
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateDoctor(
        int id,
        [FromBody] DoctorRequest request)
    {
        var doctor = await _context.Doctors.FindAsync(id);

        if (doctor == null)
        {
            return NotFound(new
            {
                message = "Doktor bulunamadı."
            });
        }

        var email = request.Email.Trim().ToLowerInvariant();

        var emailExists = await _context.Doctors
            .AnyAsync(d => d.Email == email && d.Id != id);

        if (emailExists)
        {
            return Conflict(new
            {
                message = "Bu e-posta adresi başka bir doktora ait."
            });
        }

        doctor.FullName = request.FullName.Trim();
        doctor.Email = email;
        doctor.Gender = request.Gender.Trim();
        doctor.Phone = request.Phone;
        doctor.PhotoUrl = request.PhotoUrl;
        doctor.Specialty = request.Specialty.Trim();
        doctor.ExperienceYears = request.ExperienceYears;
        doctor.University = request.University.Trim();
        doctor.About = request.About;
        doctor.Languages = request.Languages;

        await _context.SaveChangesAsync();

        return NoContent();
    }

    // Yalnızca müdür doktor silebilir.
    [Authorize(Roles = "Manager")]
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteDoctor(int id)
    {
        var doctor = await _context.Doctors.FindAsync(id);

        if (doctor == null)
        {
            return NotFound(new
            {
                message = "Doktor bulunamadı."
            });
        }

        _context.Doctors.Remove(doctor);
        await _context.SaveChangesAsync();

        return NoContent();
    }
}
