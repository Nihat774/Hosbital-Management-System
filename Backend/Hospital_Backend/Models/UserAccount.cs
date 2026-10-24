namespace Hospital_Backend.Models;

public class UserAccount
{
    public int Id { get; set; }
    public string FullName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty;
    public string Role { get; set; } = "Patient";

    public Patient? Patient { get; set; }
    public Doctor? Doctor { get; set; }
    public Staff? Staff { get; set; }
}