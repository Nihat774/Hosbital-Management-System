using Hospital_Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace Hospital_Backend.Data;

public class ApplicationDbContext:DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) :base(options)
    {
    }
    
    public DbSet<Doctor> Doctors { get; set; }
    public DbSet<Patient> Patient { get; set; }
    public DbSet<Staff> Staff { get; set; }
    public DbSet<Manager> Managers { get; set; }
    public DbSet<Appointment> Appointments { get; set; }

    }
