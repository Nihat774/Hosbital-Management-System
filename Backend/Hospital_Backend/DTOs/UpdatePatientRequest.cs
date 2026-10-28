
using System.ComponentModel.DataAnnotations;

namespace Hospital_Backend.DTOs;

public class UpdatePatientRequest
{
    [Required]
    public string FullName { get; set; } = string.Empty;

    [Required, EmailAddress]
    public string Email { get; set; } = string.Empty;

    [Range(1, 120)]
    public int Age { get; set; }

    [Required]
    public string Gender { get; set; } = string.Empty;

    public string? Phone { get; set; }
    public string? PhotoUrl { get; set; }    
}
