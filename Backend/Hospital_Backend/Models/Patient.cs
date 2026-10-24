namespace Hospital_Backend.Models;

public class Patient : Person
{
    public int Age { get; set; }
    public int? UserAccountId { get; set; }
    public UserAccount? UserAccount { get; set; }
}