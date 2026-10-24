
using System.ComponentModel.DataAnnotations;

namespace Hospital_Backend.DTOs;

public class DoctorRequest
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
    public string? PhotoUrl { get; set; }

    [Required]
    public string Specialty { get; set; } = string.Empty;

    [Range(0, 70)]
    public int ExperienceYears { get; set; }

    [Required]
    public string University { get; set; } = string.Empty;

    public string? About { get; set; }
    public string? Languages { get; set; }
}
