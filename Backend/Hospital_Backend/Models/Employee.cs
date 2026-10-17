namespace Hospital_Backend.Models;

public abstract class Employee:Person
{
    public string Email { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty;

}
