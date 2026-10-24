
namespace Hospital_Backend.DTOs;

public class CreateAppointmentRequest
{
    public int DoctorId { get; set; }

    public DateTime AppointmentDate { get; set; }
}
