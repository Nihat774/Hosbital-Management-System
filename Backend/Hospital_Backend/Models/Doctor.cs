namespace Hospital_Backend.Models
{
    public class Doctor : Employee
    {
        public string Specialty { get; set; } = string.Empty;
        public int ExperienceYears { get; set; }
        public string University { get; set; } = string.Empty;
        public string? About { get; set; }
        public string? Languages { get; set; }

        public int? UserAccountId { get; set; }
        public UserAccount? UserAccount { get; set; }
    }
}