
namespace Hospital_Backend.Models;

public class Staff : Employee
{
    public string? Jobtitle { get; set; }

    public int? UserAccountId { get; set; }
    public UserAccount? UserAccount { get; set; }
}
