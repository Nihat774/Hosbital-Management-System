
namespace Hospital_Backend.DTOs;

public class DoctorSelfUpdateRequest
{
    public string FullName { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public string Specialty { get; set; } = string.Empty;
    public int ExperienceYears { get; set; }
    public string University { get; set; } = string.Empty;
    public string? About { get; set; }
    public string? Languages { get; set; }
    public string? PhotoUrl { get; set; }
    public string Gender { get; set; }
}
