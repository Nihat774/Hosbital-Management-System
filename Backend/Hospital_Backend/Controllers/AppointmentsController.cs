
using System.Security.Claims;
using Hospital_Backend.Data;
using Hospital_Backend.DTOs;
using Hospital_Backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Hospital_Backend.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class AppointmentsController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public AppointmentsController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpPost]
    [Authorize(Roles = "Patient")]
    public async Task<IActionResult> CreateAppointment(
        CreateAppointmentRequest request)
    {
        var userIdValue = User.FindFirstValue(
            ClaimTypes.NameIdentifier);

        if (!int.TryParse(userIdValue, out var userId))
        {
            return Unauthorized(new
            {
                message = "Kullanıcı kimliği doğrulanamadı."
            });
        }

        var patient = await _context.Patient
            .SingleOrDefaultAsync(p => p.UserAccountId == userId);

        if (patient == null)
        {
            return NotFound(new
            {
                message = "Kullanıcıya ait hasta kaydı bulunamadı."
            });
        }

        if (request.AppointmentDate <= DateTime.Now)
        {
            return BadRequest(new
            {
                message = "Randevu tarihi gelecekte olmalıdır."
            });
        }

        var doctorExists = await _context.Doctors
            .AnyAsync(d => d.Id == request.DoctorId);

        if (!doctorExists)
        {
            return NotFound(new
            {
                message = "Seçilen doktor bulunamadı."
            });
        }

        var doctorBusy = await _context.Appointments
            .AnyAsync(a =>
                a.DoctorId == request.DoctorId &&
                a.AppointmentDate == request.AppointmentDate &&
                a.Status != AppointmentStatus.Rejected);

        if (doctorBusy)
        {
            return Conflict(new
            {
                message = "Doktorun bu tarih ve saatte başka bir randevusu var."
            });
        }

        var patientBusy = await _context.Appointments
            .AnyAsync(a =>
                a.PatientId == patient.Id &&
                a.AppointmentDate == request.AppointmentDate &&
                a.Status != AppointmentStatus.Rejected);

        if (patientBusy)
        {
            return Conflict(new
            {
                message = "Bu tarih ve saatte zaten bir randevunuz var."
            });
        }

        var appointment = new Appointment
        {
            PatientId = patient.Id,
            DoctorId = request.DoctorId,
            AppointmentDate = request.AppointmentDate,
            Status = AppointmentStatus.Pending
        };

        _context.Appointments.Add(appointment);
        await _context.SaveChangesAsync();

        return StatusCode(201, new
        {
            message = "Randevu talebiniz oluşturuldu.",
            appointment.Id,
            appointment.DoctorId,
            appointment.AppointmentDate,
            Status = appointment.Status.ToString()
        });
    }


    // Manager: Sistemdeki tüm randevuları görüntüle
    [HttpGet]
    [Authorize(Roles = "Manager")]
    public async Task<IActionResult> GetAllAppointments()
    {
        var appointments = await _context.Appointments
            .OrderByDescending(a => a.AppointmentDate)
            .Select(a => new
            {
                a.Id,

                PatientId = a.Patient.Id,
                PatientName = a.Patient.FullName,
                PatientAge = a.Patient.Age,
                PatientPhone = a.Patient.Phone,

                DoctorId = a.Doctor.Id,
                DoctorName = a.Doctor.FullName,
                Specialty = a.Doctor.Specialty,

                a.AppointmentDate,
                Status = a.Status.ToString()
            })
            .ToListAsync();

        return Ok(appointments);
    }


    [HttpGet("my")]
    [Authorize(Roles = "Patient")]
    public async Task<IActionResult> GetMyAppointments()
    {
        var userIdValue = User.FindFirstValue(
            ClaimTypes.NameIdentifier);

        if (!int.TryParse(userIdValue, out var userId))
        {
            return Unauthorized(new
            {
                message = "Kullanıcı kimliği doğrulanamadı."
            });
        }

        var patient = await _context.Patient
            .SingleOrDefaultAsync(p => p.UserAccountId == userId);

        if (patient == null)
        {
            return NotFound(new
            {
                message = "Hasta kaydı bulunamadı."
            });
        }

        var appointments = await _context.Appointments
            .Where(a => a.PatientId == patient.Id)
            .OrderBy(a => a.AppointmentDate)
            .Select(a => new
            {
                a.Id,
                DoctorName = a.Doctor.FullName,
                Specialty = a.Doctor.Specialty,
                a.AppointmentDate,
                a.Status
            })
            .ToListAsync();

        return Ok(appointments);
    }


    [HttpGet("doctor/my")]
    [Authorize(Roles = "Doctor")]
    public async Task<IActionResult> GetMyDoctorAppointments()
    {
        var userIdValue = User.FindFirstValue(
            ClaimTypes.NameIdentifier);

        if (!int.TryParse(userIdValue, out var userId))
        {
            return Unauthorized(new
            {
                message = "Kullanıcı kimliği doğrulanamadı."
            });
        }

        var doctor = await _context.Doctors
            .SingleOrDefaultAsync(d => d.UserAccountId == userId);
        Console.WriteLine($"Token UserId: {userId}, DoctorId: {doctor?.Id}");

        if (doctor == null)
        {
            return NotFound(new
            {
                message = "Doktor kaydı bulunamadı."
            });
        }

        var appointments = await _context.Appointments
            .Where(a => a.DoctorId == doctor.Id)
            .OrderBy(a => a.AppointmentDate)
            .Select(a => new
            {
                a.Id,
                PatientName = a.Patient.FullName,
                PatientAge = a.Patient.Age,
                PatientPhone = a.Patient.Phone,
                a.AppointmentDate,
                Status = a.Status.ToString()
            })
            .ToListAsync();

        return Ok(appointments);
    }


    // randevu approve 

    [HttpPut("{id}/approve")]
    [Authorize(Roles = "Doctor")]
    public async Task<IActionResult> ApproveAppointment(int id)
    {
        var userIdValue = User.FindFirstValue(ClaimTypes.NameIdentifier);

        if (!int.TryParse(userIdValue, out var userId))
        {
            return Unauthorized(new
            {
                message = "Kullanıcı kimliği doğrulanamadı."
            });
        }

        var doctor = await _context.Doctors
            .SingleOrDefaultAsync(d => d.UserAccountId == userId);

        if (doctor == null)
        {
            return NotFound(new
            {
                message = "Doktor kaydı bulunamadı."
            });
        }

        var appointment = await _context.Appointments
            .SingleOrDefaultAsync(a => a.Id == id);

        if (appointment == null)
        {
            return NotFound(new
            {
                message = "Randevu bulunamadı."
            });
        }

        if (appointment.DoctorId != doctor.Id)
        {
            return Forbid();
        }

        if (appointment.Status != AppointmentStatus.Pending)
        {
            return BadRequest(new
            {
                message = "Yalnızca bekleyen randevular onaylanabilir."
            });
        }

        appointment.Status = AppointmentStatus.Approved;

        await _context.SaveChangesAsync();

        return Ok(new
        {
            message = "Randevu başarıyla onaylandı.",
            appointment.Id,
            Status = appointment.Status.ToString()
        });
    }

    // Randevu reject 
    [HttpPut("{id}/reject")]
    [Authorize(Roles = "Doctor")]
    public async Task<IActionResult> RejectAppointment(int id)
    {
        var userIdValue = User.FindFirstValue(ClaimTypes.NameIdentifier);

        if (!int.TryParse(userIdValue, out var userId))
        {
            return Unauthorized(new
            {
                message = "Kullanıcı kimliği doğrulanamadı."
            });
        }

        var doctor = await _context.Doctors
            .SingleOrDefaultAsync(d => d.UserAccountId == userId);

        if (doctor == null)
        {
            return NotFound(new
            {
                message = "Doktor kaydı bulunamadı."
            });
        }

        var appointment = await _context.Appointments
            .SingleOrDefaultAsync(a => a.Id == id);

        if (appointment == null)
        {
            return NotFound(new
            {
                message = "Randevu bulunamadı."
            });
        }

        if (appointment.DoctorId != doctor.Id)
        {
            return Forbid();
        }

        if (appointment.Status != AppointmentStatus.Pending)
        {
            return BadRequest(new
            {
                message = "Yalnızca bekleyen randevular reddedilebilir."
            });
        }

        appointment.Status = AppointmentStatus.Rejected;

        await _context.SaveChangesAsync();

        return Ok(new
        {
            message = "Randevu başarıyla reddedildi.",
            appointment.Id,
            Status = appointment.Status.ToString()
        });
    }

    // Hasta: Bekleyen randevusunu iptal et
    [HttpDelete("{id}")]
    [Authorize(Roles = "Patient")]
    public async Task<IActionResult> CancelAppointment(int id)
    {
        var userIdValue = User.FindFirstValue(
            ClaimTypes.NameIdentifier);

        if (!int.TryParse(userIdValue, out var userId))
        {
            return Unauthorized(new
            {
                message = "Kullanıcı kimliği doğrulanamadı."
            });
        }

        var patient = await _context.Patient
            .SingleOrDefaultAsync(p => p.UserAccountId == userId);

        if (patient == null)
        {
            return NotFound(new
            {
                message = "Hasta kaydı bulunamadı."
            });
        }

        var appointment = await _context.Appointments
            .SingleOrDefaultAsync(a => a.Id == id);

        if (appointment == null)
        {
            return NotFound(new
            {
                message = "Randevu bulunamadı."
            });
        }

        // Hasta yalnızca kendi randevusunu iptal edebilir.
        if (appointment.PatientId != patient.Id)
        {
            return Forbid();
        }

        // Yalnızca doktorun henüz onaylamadığı randevular iptal edilebilir.
        if (appointment.Status != AppointmentStatus.Pending)
        {
            return BadRequest(new
            {
                message = "Yalnızca onay bekleyen randevular iptal edilebilir."
            });
        }

        _context.Appointments.Remove(appointment);
        await _context.SaveChangesAsync();

        return Ok(new
        {
            message = "Randevunuz başarıyla iptal edildi."
        });
    }

}
