using ProjetoHotelAviao.Models;

namespace ProjetoHotelAviao.Models.ViewModels;

public class AdminViewModel
{
    public List<Flight> Flights { get; set; } = new();
    public List<Hotel> Hotels { get; set; } = new();
    public List<Booking> RecentBookings { get; set; } = new();
    public List<HotelBooking> RecentHotelBookings { get; set; } = new();
    
    public int TotalFlights { get; set; }
    public int TotalHotels { get; set; }
    public int TotalBookings { get; set; }
    public decimal TotalRevenue { get; set; }
    
    public int ActiveUsers { get; set; }
    public decimal ConversionRate { get; set; }

    public Flight NewFlight { get; set; } = new();
    public Hotel NewHotel { get; set; } = new();

    public IFormFile? FlightLogoUpload { get; set; }
    public IFormFile? FlightMainImageUpload { get; set; }
    public IFormFile? HotelMainImageUpload { get; set; }
}
