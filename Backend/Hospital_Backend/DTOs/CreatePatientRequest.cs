
using System.ComponentModel.DataAnnotations;

namespace Hospital_Backend.DTOs;

public class CreatePatientRequest
{
    [Required]
    public string FullName { get; set; } = string.Empty;

    [Required]
    [EmailAddress]
    public string Email { get; set; } = string.Empty;

    [Required]
    [MinLength(8)]
    public string Password { get; set; } = string.Empty;

    [Range(1, 100)]
    public int Age { get; set; }

    [Required]
    public string Gender { get; set; } = string.Empty;

    public string? Phone { get; set; }
    public string? PhotoUrl { get; set; }
}
