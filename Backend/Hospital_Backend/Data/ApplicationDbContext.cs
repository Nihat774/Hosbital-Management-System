
using Hospital_Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace Hospital_Backend.Data;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(
        DbContextOptions<ApplicationDbContext> options) : base(options)
    {
    }

    public DbSet<Doctor> Doctors { get; set; }
    public DbSet<Patient> Patient { get; set; }
    public DbSet<Staff> Staff { get; set; }
    public DbSet<Manager> Managers { get; set; }
    public DbSet<Appointment> Appointments { get; set; }
    public DbSet<UserAccount> UserAccounts { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Her kullanıcı hesabının e-postası benzersiz olmalıdır.
        modelBuilder.Entity<UserAccount>()
            .HasIndex(user => user.Email)
            .IsUnique();

        // Hasta - kullanıcı hesabı ilişkisi
        modelBuilder.Entity<Patient>()
            .HasOne(patient => patient.UserAccount)
            .WithOne(user => user.Patient)
            .HasForeignKey<Patient>(patient => patient.UserAccountId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<Patient>()
            .HasIndex(patient => patient.UserAccountId)
            .IsUnique()
            .HasFilter("[UserAccountId] IS NOT NULL");

        // Doktor - kullanıcı hesabı ilişkisi
        modelBuilder.Entity<Doctor>()
            .HasOne(doctor => doctor.UserAccount)
            .WithOne(user => user.Doctor)
            .HasForeignKey<Doctor>(doctor => doctor.UserAccountId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<Doctor>()
            .HasIndex(doctor => doctor.UserAccountId)
            .IsUnique()
            .HasFilter("[UserAccountId] IS NOT NULL");

        modelBuilder.Entity<Staff>()
    .HasOne(staff => staff.UserAccount)
    .WithOne(user => user.Staff)
    .HasForeignKey<Staff>(staff => staff.UserAccountId)
    .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<Staff>()
            .HasIndex(staff => staff.UserAccountId)
            .IsUnique()
            .HasFilter("[UserAccountId] IS NOT NULL");
    }
}
