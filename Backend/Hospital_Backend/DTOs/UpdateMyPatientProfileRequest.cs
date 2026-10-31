namespace Hospital_Backend.DTOs;

public class UpdateMyPatientProfileRequest
{
    public string FullName { get; set; } = string.Empty;
    public int Age { get; set; }
    public string Gender { get; set; } = string.Empty;
    public string? Phone { get; set; }
    public string? PhotoUrl { get; set; }
}