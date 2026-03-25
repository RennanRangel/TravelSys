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

    [HttpGet]
    public async Task<IActionResult> Index()
    {
        if (User.Identity?.IsAuthenticated == true)
        {
            return RedirectToAction("Listing");
        }
        
        var recentHotels = await _context.Hotels
            .AsNoTracking()
            .OrderByDescending(h => h.Id)
            .Take(4)
            .ToListAsync();
            
        return View("Findstays", recentHotels);
    }

    [Authorize]
    [HttpGet]
    public async Task<IActionResult> Listing(string sortOrder, int? pageNumber, int? minPrice, int? maxPrice, int[] rating, string[] amenities, string[] freebies, string location, string propertyType)
    {
        ViewData["CurrentSort"] = sortOrder;
        ViewData["MinPrice"] = minPrice;
        ViewData["MaxPrice"] = maxPrice;
        ViewData["SelectedRatings"] = rating;
        ViewData["SelectedAmenities"] = amenities;
        ViewData["SelectedFreebies"] = freebies;
        ViewData["CurrentLocation"] = location;
        ViewData["CurrentType"] = propertyType;
        var query = _context.Hotels.AsNoTracking();

        // 1. Filtering (Server Side)
        if (!string.IsNullOrEmpty(location))
        {
            query = query.Where(h => h.Location.Contains(location) || h.Name.Contains(location));
        }

        if (!string.IsNullOrEmpty(propertyType))
        {
            query = query.Where(h => h.Type == propertyType);
        }

        if (minPrice.HasValue)
        {
            query = query.Where(h => h.Price >= (decimal)minPrice.Value);
        }

        if (maxPrice.HasValue)
        {
            query = query.Where(h => h.Price <= (decimal)maxPrice.Value);
        }

        if (rating != null && rating.Length > 0)
        {
            var minRate = rating.Min();
            query = query.Where(h => h.Rating >= minRate);
        }

        // Amenities filtering (comma separated in DB)
        if (amenities != null && amenities.Length > 0)
        {
            foreach (var amenity in amenities)
            {
                query = query.Where(h => h.Amenities != null && h.Amenities.Contains(amenity));
            }
        }

        // 2. Counts (Dynamic)
        ViewData["HotelCount"] = await _context.Hotels.CountAsync(h => h.Type == "Hotel");
        ViewData["MotelCount"] = await _context.Hotels.CountAsync(h => h.Type == "Motel");
        ViewData["ResortCount"] = await _context.Hotels.CountAsync(h => h.Type == "Resort");

        ViewData["AvailableLocations"] = await _context.Hotels
            .Select(h => h.Location)
            .Distinct()
            .OrderBy(l => l)
            .ToListAsync();

        // 3. Sorting (Server Side)
        query = sortOrder switch
        {
            "price_desc" => query.OrderByDescending(h => h.Price),
            "rating_desc" => query.OrderByDescending(h => h.Rating),
            _ => query.OrderBy(h => h.Price),
        };

        // 4. Pagination
        int pageSize = 5;
        var paginatedHotels = await PaginatedList<Hotel>.CreateAsync(query, pageNumber ?? 1, pageSize);
        
        return View("Listing", paginatedHotels);
    }

    [HttpGet]
    public async Task<IActionResult> Details(int id)
    {
        var hotel = await _context.Hotels.FindAsync(id);
        if (hotel == null) return NotFound();
        return View(hotel);
    }

    [HttpGet]
    public async Task<IActionResult> Booking(int id, string? roomType)
    {
        var hotel = await _context.Hotels.FindAsync(id);
        if (hotel == null) return NotFound();
        ViewBag.RoomType = roomType;
        return View("hotel-booking", hotel);
    }

    [HttpGet]
    public async Task<IActionResult> Payment(int id, string? roomType)
    {
        var hotel = await _context.Hotels.FindAsync(id);
        if (hotel == null) return NotFound();
       
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        ViewBag.UserCards = await _context.UserCards
            .Where(c => c.UserId == userId)
            .ToListAsync();

        ViewBag.RoomType = roomType;
        return View("hotel-payment", hotel);
    }

    [HttpPost]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> CompletePayment(int hotelId, string paymentType, int nights = 1, string? roomType = null)
    {
        var hotel = await _context.Hotels.FindAsync(hotelId);
        if (hotel == null) return NotFound();

        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!await _context.UserCards.AnyAsync(c => c.UserId == userId))
        {
            TempData["Error"] = "You must add a credit card to complete the reservation.";
            return RedirectToAction("Payment", new { id = hotelId });
        }

        var baseFare = hotel.Price * nights;
        var total = baseFare + (baseFare * 0.1m) + 15m;
        var checkIn = DateTime.Now.AddDays(7);

        var booking = new HotelBooking
        {
            UserId = userId ?? "anonymous",
            UserEmail = User.FindFirstValue(ClaimTypes.Email) ?? "anonymous@email.com",
            UserName = User.Identity?.Name,
            HotelId = hotelId,
            BookingDate = DateTime.Now,
            CheckIn = checkIn,
            CheckOut = checkIn.AddDays(nights),
            Nights = nights,
            RoomType = roomType ?? "Standard Room",
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

    [HttpGet]
    public async Task<IActionResult> Ticket(int? id)
    {
        int ticketId = id ?? (TempData["TicketId"] as int? ?? 0);
        
        HotelBooking? booking = null;

        if (ticketId > 0)
        {
            booking = await _context.HotelBookings
                .Include(b => b.Hotel)
                .FirstOrDefaultAsync(b => b.Id == ticketId);
        }

        // Se não achou por ID ou TempData, pega o mais recente de todos
        if (booking == null)
        {
            booking = await _context.HotelBookings
                .Include(b => b.Hotel)
                .OrderByDescending(b => b.Id)
                .FirstOrDefaultAsync();
        }

        if (booking == null)
        {
            return NotFound("Nenhuma reserva encontrada no sistema.");
        }

        return View("hotel-ticket-booking", booking);
    }


    [HttpGet]
    public IActionResult Create() => View();

    [HttpPost]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> Create([Bind("Id,Name,Type,Location,Overview,MapUrl,MainImage,GalleryImages,Stars,Price,Rating,Reviews,Amenities,Region,BookingMode,CheckIn,CheckOut,ReceptionMode,ZipCode,Country")] Hotel hotel)
    {
        if (ModelState.IsValid)
        {
            _context.Add(hotel);
            await _context.SaveChangesAsync();
            return RedirectToAction(nameof(Listing));
        }
        return View(hotel);
    }
}
