namespace Hospital_Backend.Models
{
    public class Doctor:Employee
    {
        public string Specialty { get; set; }
        public int ExperienceYears { get; set; }
        public string University { get; set; }
        public string? About { get; set; }
        public string? Languages { get; set; } 

    }
}
