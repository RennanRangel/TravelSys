using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ProjetoHotelAviao.Models;

public class HotelBooking
{
    public int Id { get; set; }
    
    [Required]
    public string UserId { get; set; } = string.Empty;
    
    [Required]
    public string UserEmail { get; set; } = string.Empty;
    
    public string? UserName { get; set; }
    
    public int HotelId { get; set; }
    
    [ForeignKey("HotelId")]
    public Hotel? Hotel { get; set; }
    
    public DateTime BookingDate { get; set; } = DateTime.Now;
    
    public DateTime CheckIn { get; set; }
    
    public DateTime CheckOut { get; set; }
    
    public int Nights { get; set; } = 1;
    
    public string RoomType { get; set; } = "Standard Room";
    
    public string PaymentType { get; set; } = "full";
    
    [Column(TypeName = "decimal(18,2)")]
    public decimal TotalPrice { get; set; }
    
    public string Status { get; set; } = "Confirmed";
    
    public string? ReservationNumber { get; set; }
}
