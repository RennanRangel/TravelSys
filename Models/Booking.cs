using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ProjetoHotelAviao.Models;

public class Booking
{
    public int Id { get; set; }
    
    [Required]
    public string UserId { get; set; } = string.Empty;
    
    [Required]
    public string UserEmail { get; set; } = string.Empty; 
    
    public string? UserName { get; set; }
    
    public int FlightId { get; set; }
    
    [ForeignKey("FlightId")]
    public Flight? Flight { get; set; }
    
    public DateTime BookingDate { get; set; } 
    
    public string PaymentType { get; set; } = "full"; 
    
    [Column(TypeName = "decimal(18,2)")]
    public decimal TotalPrice { get; set; }
    
    public string Status { get; set; } = "Confirmed"; 
    
    public string? TicketNumber { get; set; }
    public string? Gate { get; set; }
    public string? Seat { get; set; }
}
