
using Hospital_Backend.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Hospital_Backend.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "Manager")]
public class DashboardController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public DashboardController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet("stats")]
    public async Task<IActionResult> GetStats()
    {
        var stats = new
        {
            TotalDoctors = await _context.Doctors.CountAsync(),
            TotalStaff = await _context.Staff.CountAsync(),
            TotalPatients = await _context.Patient.CountAsync(),
            TotalAppointments = await _context.Appointments.CountAsync()
        };

        return Ok(stats);
    }
}
