using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using ProjetoHotelAviao.Data;
using ProjetoHotelAviao.Models;
using System.Security.Claims;

namespace ProjetoHotelAviao.Controllers;

public class HotelsController : Controller
{
    private readonly ApplicationDbContext _context;

    public HotelsController(ApplicationDbContext context)
    {
        _context = context;
    }

    [Authorize]
    public async Task<IActionResult> Index(string sortOrder, int? pageNumber, int? minPrice, int? maxPrice, int[] rating, string[] amenities, string[] freebies, string location, string propertyType)
    {
        ViewData["CurrentSort"] = sortOrder;
        ViewData["MinPrice"] = minPrice;
        ViewData["MaxPrice"] = maxPrice;
        ViewData["SelectedRatings"] = rating;
        ViewData["SelectedAmenities"] = amenities;
        ViewData["SelectedFreebies"] = freebies;
        ViewData["CurrentLocation"] = location;
        ViewData["CurrentType"] = propertyType;
        
        var hotelsQuery = from h in _context.Hotels select h;

        if (!string.IsNullOrEmpty(location))
        {
            hotelsQuery = hotelsQuery.Where(h => h.Location.Contains(location) || h.Name.Contains(location));
        }

        
        ViewData["HotelCount"] = await hotelsQuery.CountAsync(h => h.Type == "Hotel");
        ViewData["MotelCount"] = await hotelsQuery.CountAsync(h => h.Type == "Motel");
        ViewData["ResortCount"] = await hotelsQuery.CountAsync(h => h.Type == "Resort");

        
        var locations = await _context.Hotels
            .Select(h => h.Location)
            .Distinct()
            .OrderBy(l => l)
            .ToListAsync();
        ViewData["AvailableLocations"] = locations;

        var hotelsList = await hotelsQuery.AsNoTracking().ToListAsync();

        IEnumerable<Hotel> hotels = hotelsList;

        if (!string.IsNullOrEmpty(propertyType))
        {
            hotels = hotels.Where(h => h.Type == propertyType);
        }

        if (minPrice.HasValue)
        {
            hotels = hotels.Where(h => h.Price >= (decimal)minPrice.Value);
        }
        if (maxPrice.HasValue)
        {
            hotels = hotels.Where(h => h.Price <= (decimal)maxPrice.Value);
        }

        if (rating != null && rating.Length > 0)
        {
            var minRating = rating.Min();
            hotels = hotels.Where(h => h.Rating >= minRating);
        }

        if (amenities != null && amenities.Length > 0)
        {
            foreach (var amenity in amenities)
            {
                hotels = hotels.Where(h => h.Amenities != null && h.Amenities.Contains(amenity, StringComparison.OrdinalIgnoreCase));
            }
        }

        if (freebies != null && freebies.Length > 0)
        {
            foreach (var freebie in freebies)
            {
                hotels = hotels.Where(h => h.Amenities != null && h.Amenities.Contains(freebie, StringComparison.OrdinalIgnoreCase));
            }
        }

        switch (sortOrder)
        {
            case "price_desc":
                hotels = hotels.OrderByDescending(h => h.Price);
                break;
            case "rating_desc":
                hotels = hotels.OrderByDescending(h => h.Rating);
                break;
            case "price_asc":
            default:
                hotels = hotels.OrderBy(h => h.Price);
                break;
        }
        
        int pageSize = 5;
    
        return View(PaginatedList<Hotel>.Create(hotels.ToList(), pageNumber ?? 1, pageSize));
    }

    [AcceptVerbs("Get", "Post")]
    public async Task<IActionResult> Details(int id)
    {
        var hotel = await _context.Hotels.FindAsync(id);
        if (hotel == null)
        {
            return NotFound();
        }
        return View(hotel);
    }

    [AcceptVerbs("Get", "Post")]
    public async Task<IActionResult> Booking(int id)
    {
        var hotel = await _context.Hotels.FindAsync(id);
        if (hotel == null)
        {
            return NotFound();
        }
        return View("hotel-booking", hotel);
    }

    [AcceptVerbs("Get", "Post")]
    public async Task<IActionResult> Payment(int id)
    {
        var hotel = await _context.Hotels.FindAsync(id);
        if (hotel == null)
        {
            return NotFound();
        }
       
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        ViewBag.UserCards = await _context.UserCards
            .Where(c => c.UserId == userId)
            .ToListAsync();

        return View("hotel-payment", hotel);
    }

    
    [HttpPost]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> CompletePayment(int hotelId, string paymentType, int nights = 1)
    {
        var hotel = await _context.Hotels.FindAsync(hotelId);
        if (hotel == null)
        {
            return NotFound();
        }

        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!await _context.UserCards.AnyAsync(c => c.UserId == userId))
        {
            TempData["Error"] = "You must add a credit card to complete the reservation.";
            return RedirectToAction("Payment", new { id = hotelId });
        }

        
        var baseFare = hotel.Price * nights;
        var taxes = baseFare * 0.1m;
        var serviceFee = 15m;
        var total = baseFare + taxes + serviceFee;

        var checkIn = DateTime.Now.AddDays(7);
        var checkOut = checkIn.AddDays(nights);

        
        var booking = new HotelBooking
        {
            UserId = User.FindFirstValue(ClaimTypes.NameIdentifier) ?? User.Identity?.Name ?? "anonymous",
            UserEmail = User.FindFirstValue(ClaimTypes.Email) ?? User.Identity?.Name ?? "anonymous@email.com",
            UserName = User.Identity?.Name,
            HotelId = hotelId,
            BookingDate = DateTime.Now,
            CheckIn = checkIn,
            CheckOut = checkOut,
            Nights = nights,
            RoomType = "Standard Room",
            PaymentType = paymentType ?? "full",
            TotalPrice = total,
            Status = "Confirmed",
            ReservationNumber = $"RES{DateTime.Now:yyyyMMdd}{hotelId:D4}{new Random().Next(1000, 9999)}"
        };

        _context.HotelBookings.Add(booking);
        await _context.SaveChangesAsync();

        TempData["TicketId"] = booking.Id;
        return RedirectToAction("Ticket");
    }

    
    [AcceptVerbs("Get", "Post")]
    public async Task<IActionResult> Ticket(int? id)
    {
        if (id == null || id == 0)
        {
            if (TempData["TicketId"] is int ticketId)
            {
                id = ticketId;
            }
            else if (HttpContext.Request.Method == "POST" && HttpContext.Request.Form.ContainsKey("id"))
            {
                 if (int.TryParse(HttpContext.Request.Form["id"], out int formId))
                 {
                     id = formId;
                 }
            }
        }

        if (id == null || id == 0) return NotFound();

        var booking = await _context.HotelBookings
            .Include(b => b.Hotel)
            .FirstOrDefaultAsync(b => b.Id == id.Value);
        
        if (booking == null)
        {
            
            var hotel = await _context.Hotels.FindAsync(id.Value);
            if (hotel != null)
            {
                return View("hotel-ticket", hotel);
            }
            return NotFound();
        }

        return View("hotel-ticket-booking", booking);
    }

    
    [Authorize]
    public async Task<IActionResult> MyReservations()
    {
        var userEmail = User.Identity?.Name;
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier) ?? userEmail;

        var bookings = await _context.HotelBookings
            .Include(b => b.Hotel)
            .Where(b => b.UserId == userId || b.UserEmail == userEmail)
            .OrderByDescending(b => b.BookingDate)
            .ToListAsync();

        return View(bookings);
    }

    
    [HttpPost]
    [Authorize]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> DeleteReservation(int id)
    {
        var userEmail = User.Identity?.Name;
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier) ?? userEmail;

        var booking = await _context.HotelBookings
            .FirstOrDefaultAsync(b => b.Id == id && (b.UserId == userId || b.UserEmail == userEmail));

        if (booking != null)
        {
            _context.HotelBookings.Remove(booking);
            await _context.SaveChangesAsync();
        }

        return RedirectToAction("MyReservations");
    }

    
    public IActionResult Create()
    {
        return View();
    }

    
    [HttpPost]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> Create([Bind("Id,Name,Location,Overview,MapUrl,MainImage,GalleryImages,Stars,Price,Rating,Reviews,Amenities")] Hotel hotel)
    {
        if (ModelState.IsValid)
        {
            _context.Add(hotel);
            await _context.SaveChangesAsync();
            return RedirectToAction(nameof(Index));
        }
        return View(hotel);
    }
}
