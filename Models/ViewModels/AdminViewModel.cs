using ProjetoHotelAviao.Models;

namespace ProjetoHotelAviao.Models.ViewModels;

public class AdminViewModel
{
    public List<Flight> Flights { get; set; } = new();
    public List<Hotel> Hotels { get; set; } = new();
    
   
    public Flight NewFlight { get; set; } = new();
    public Hotel NewHotel { get; set; } = new();

    public IFormFile? FlightLogoUpload { get; set; }
    public IFormFile? FlightMainImageUpload { get; set; }
    public IFormFile? HotelMainImageUpload { get; set; }
}
