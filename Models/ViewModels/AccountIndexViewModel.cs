using System.Collections.Generic;
using ProjetoHotelAviao.Models;

namespace ProjetoHotelAviao.Models.ViewModels
{
    public class AccountIndexViewModel
    {
        public ApplicationUser User { get; set; } = new ApplicationUser();
        public List<Booking> FlightBookings { get; set; } = new List<Booking>();
        public List<HotelBooking> StayBookings { get; set; } = new List<HotelBooking>();
        public List<UserCard> PaymentMethods { get; set; } = new List<UserCard>();
    }
}
