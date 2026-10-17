namespace Hospital_Backend.Models;

public class Appointment
{
    public int Id { get; set; }
    public int PatientId { get; set; }
    public Patient Patient { get; set; } = null!;
    public int DoctorId { get; set; }
    public Doctor Doctor { get; set; } = null!;
    public DateTime AppointmentDate { get; set; }
    public AppointmentStatus Status { get; set; }
         = AppointmentStatus.Pending;
}
public enum AppointmentStatus { 
Pending,
Approved,
Rejected,

}
