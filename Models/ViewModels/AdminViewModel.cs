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

    // Chart Data
    public List<RevenueDataPoint> RevenueByMonth { get; set; } = new();
    public List<DestinationDataPoint> BookingsByDestination { get; set; } = new();
}

public class RevenueDataPoint
{
    public string Month { get; set; } = string.Empty;
    public decimal Revenue { get; set; }
}

public class DestinationDataPoint
{
    public string Destination { get; set; } = string.Empty;
    public int Count { get; set; }
}
