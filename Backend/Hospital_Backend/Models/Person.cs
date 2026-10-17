namespace Hospital_Backend.Models;

public abstract class Person
{
    public int Id { get; private set; }
    public string FullName { get; set; } = string.Empty;
    public string Gender { get; set; } = string.Empty;
    public string? Phone { get; set; }
    public string? PhotoUrl { get; set; }

}
