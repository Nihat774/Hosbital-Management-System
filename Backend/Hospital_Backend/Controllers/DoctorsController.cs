
using Hospital_Backend.Data;
using Hospital_Backend.DTOs;
using Hospital_Backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;
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

        // E-posta hem doktor hem kullanıcı hesabı tablolarında kontrol edilir.
        var doctorExists = await _context.Doctors
            .AnyAsync(d => d.Email == email);

        var accountExists = await _context.UserAccounts
            .AnyAsync(u => u.Email == email);

        if (doctorExists || accountExists)
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
            // Önce giriş hesabını oluşturuyoruz.
            var user = new UserAccount
            {
                FullName = request.FullName.Trim(),
                Email = email,
                Role = "Doctor"
            };

            var passwordHasher = new PasswordHasher<UserAccount>();

            user.PasswordHash = passwordHasher.HashPassword(
                user,
                request.Password
            );

            _context.UserAccounts.Add(user);
            await _context.SaveChangesAsync();

            // Ardından doktor profilini oluşturup hesapla ilişkilendiriyoruz.
            var doctor = new Doctor
            {
                FullName = request.FullName.Trim(),
                Email = email,
                Gender = request.Gender.Trim(),
                Phone = request.Phone?.Trim(),
                PhotoUrl = request.PhotoUrl,
                Specialty = request.Specialty.Trim(),
                ExperienceYears = request.ExperienceYears,
                University = request.University.Trim(),
                About = request.About,
                Languages = request.Languages,
                UserAccountId = user.Id
            };

            _context.Doctors.Add(doctor);
            await _context.SaveChangesAsync();

            await transaction.CommitAsync();

            return CreatedAtAction(
                nameof(GetDoctor),
                new { id = doctor.Id },
                new
                {
                    message = "Doktor ve giriş hesabı başarıyla oluşturuldu.",
                    doctor.Id,
                    doctor.FullName,
                    doctor.Email,
                    doctor.Specialty,
                    user.Role
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


    // Yalnızca Manager doktor bilgilerini güncelleyebilir.
    [Authorize(Roles = "Manager")]
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateDoctor(
        int id,
        [FromBody] DoctorUpdateRequest request)
    {
        var doctor = await _context.Doctors
            .Include(d => d.UserAccount)
            .FirstOrDefaultAsync(d => d.Id == id);

        if (doctor == null)
        {
            return NotFound(new
            {
                message = "Doktor bulunamadı."
            });
        }

        var email = request.Email.Trim().ToLowerInvariant();

        var doctorEmailExists = await _context.Doctors
            .AnyAsync(d => d.Email == email && d.Id != id);

        var accountEmailExists = await _context.UserAccounts
            .AnyAsync(u =>
                u.Email == email &&
                u.Id != doctor.UserAccountId);

        if (doctorEmailExists || accountEmailExists)
        {
            return Conflict(new
            {
                message = "Bu e-posta adresi başka bir hesaba ait."
            });
        }

        doctor.FullName = request.FullName.Trim();
        doctor.Email = email;
        doctor.Gender = request.Gender.Trim();
        doctor.Phone = request.Phone?.Trim();
        doctor.PhotoUrl = request.PhotoUrl;
        doctor.Specialty = request.Specialty.Trim();
        doctor.ExperienceYears = request.ExperienceYears;
        doctor.University = request.University.Trim();
        doctor.About = request.About;
        doctor.Languages = request.Languages;

        if (doctor.UserAccount != null)
        {
            doctor.UserAccount.FullName = doctor.FullName;
            doctor.UserAccount.Email = email;
        }

        await _context.SaveChangesAsync();

        return Ok(new
        {
            message = "Doktor bilgileri başarıyla güncellendi."
        });
    }


    // Yalnızca Manager doktor silebilir.
    [Authorize(Roles = "Manager")]
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteDoctor(int id)
    {
        var doctor = await _context.Doctors
            .Include(d => d.UserAccount)
            .FirstOrDefaultAsync(d => d.Id == id);

        if (doctor == null)
        {
            return NotFound(new
            {
                message = "Doktor bulunamadı."
            });
        }

        // Doktora bağlı randevular varsa silme işlemini engelle.
        var hasAppointments = await _context.Appointments
            .AnyAsync(a => a.DoctorId == id);

        if (hasAppointments)
        {
            return Conflict(new
            {
                message = "Bu doktora bağlı randevular var. Önce randevuları yönetin."
            });
        }

        var userAccount = doctor.UserAccount;

        await using var transaction =
            await _context.Database.BeginTransactionAsync();

        try
        {
            _context.Doctors.Remove(doctor);
            await _context.SaveChangesAsync();

            // İlişkili giriş hesabını da sil.
            if (userAccount != null)
            {
                _context.UserAccounts.Remove(userAccount);
                await _context.SaveChangesAsync();
            }

            await transaction.CommitAsync();

            return Ok(new
            {
                message = "Doktor ve giriş hesabı başarıyla silindi."
            });
        }
        catch (DbUpdateException)
        {
            await transaction.RollbackAsync();

            return Conflict(new
            {
                message = "Doktor silinemedi. İlişkili kayıtları kontrol edin."
            });
        }
    }


    // Doktor yalnızca kendi profilini görüntüleyebilir.
    [Authorize(Roles = "Doctor")]
    [HttpGet("my-profile")]
    public async Task<IActionResult> GetMyProfile()
    {
        var userIdClaim = User.FindFirst(
            System.Security.Claims.ClaimTypes.NameIdentifier
        )?.Value;

        if (!int.TryParse(userIdClaim, out var userId))
        {
            return Unauthorized(new
            {
                message = "Kullanıcı kimliği doğrulanamadı."
            });
        }

        var doctor = await _context.Doctors
            .Where(d => d.UserAccountId == userId)
            .Select(d => new
            {
                d.Id,
                d.FullName,
                d.Email,
                d.Gender,
                d.Phone,
                d.PhotoUrl,
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
                message = "Doktor profili bulunamadı."
            });
        }

        return Ok(doctor);
    }

    // Doktor yalnızca kendi profilindeki kişisel bilgileri güncelleyebilir.
    [Authorize(Roles = "Doctor")]
    [HttpPut("my-profile")]
    public async Task<IActionResult> UpdateMyProfile(
        [FromBody] DoctorSelfUpdateRequest request)
    {
        var userIdClaim = User.FindFirst(
            System.Security.Claims.ClaimTypes.NameIdentifier
        )?.Value;

        if (!int.TryParse(userIdClaim, out var userId))
        {
            return Unauthorized(new
            {
                message = "Kullanıcı kimliği doğrulanamadı."
            });
        }

        var doctor = await _context.Doctors
            .Include(d => d.UserAccount)
            .FirstOrDefaultAsync(d => d.UserAccountId == userId);

        if (doctor == null)
        {
            return NotFound(new
            {
                message = "Doktor profili bulunamadı."
            });
        }

        if (string.IsNullOrWhiteSpace(request.FullName) ||
            string.IsNullOrWhiteSpace(request.Phone))
        {
            return BadRequest(new
            {
                message = "Ad soyad ve telefon alanları zorunludur."
            });
        }

        if (request.ExperienceYears < 0)
        {
            return BadRequest(new
            {
                message = "Deneyim yılı negatif olamaz."
            });
        }

        doctor.FullName = request.FullName.Trim();
        doctor.Phone = request.Phone.Trim();
        doctor.Specialty = request.Specialty.Trim();
        doctor.ExperienceYears = request.ExperienceYears;
        doctor.University = request.University.Trim();
        doctor.About = request.About?.Trim();
        doctor.Languages = request.Languages?.Trim();

        // Giriş hesabındaki ad da güncel kalsın.
        if (doctor.UserAccount != null)
        {
            doctor.UserAccount.FullName = doctor.FullName;
        }

        await _context.SaveChangesAsync();

        return Ok(new
        {
            message = "Profil bilgileriniz güncellendi."
        });
    }


}
