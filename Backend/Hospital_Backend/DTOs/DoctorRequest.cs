using System.ComponentModel.DataAnnotations;
using System.Globalization;

namespace Hospital_Backend.DTOs;

public class DoctorRequest
{
    [Required]
    public string FullName { get; set; }
    [Required]
    public string Email { get; set; }
    [Required]
    public string Gender { get; set; }
    public string? Phone { get; set; }
    public string? PhotoUrl { get; set; }
    [Required]
    public string Specialty { get; set; } = string.Empty;
    [Range(0, 70)]
    public int ExperienceYears { get; set;}
    [Required]
    public string University { get; set; }
    public string? About { get; set; }
    public string? Languages { get; set; }




}
