using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using ProjetoHotelAviao.Data;
using ProjetoHotelAviao.Models;
using System.Security.Claims;

namespace ProjetoHotelAviao.Controllers;

public class FlightsController : Controller
{
    private readonly ApplicationDbContext _context;

    public FlightsController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public IActionResult Index()
    {
        if (User.Identity?.IsAuthenticated == true)
        {
            return RedirectToAction("Listing");
        }
        return View("Findflight");
    }

    [Authorize]
    [HttpGet]
    public async Task<IActionResult> Listing(string sortOrder, int? pageNumber, int? minPrice, int? maxPrice, int? minTime, int? maxTime, int[] rating, string[] airlines, string[] tripType, string? route)
    {
        ViewData["CurrentSort"] = sortOrder;
        ViewData["MinPrice"] = minPrice;
        ViewData["MaxPrice"] = maxPrice;
        ViewData["MinTime"] = minTime;
        ViewData["MaxTime"] = maxTime;
        ViewData["SelectedRatings"] = rating;
        ViewData["SelectedAirlines"] = airlines;
        ViewData["SelectedTripTypes"] = tripType;
        ViewData["SearchRoute"] = route;
        
        var query = _context.Flights.AsNoTracking();

        // 1. Static City/Route List (for UI)
        ViewData["AvailableCities"] = await _context.Flights
            .Where(f => !string.IsNullOrEmpty(f.From))
            .Select(f => f.From)
            .Union(_context.Flights.Where(f => !string.IsNullOrEmpty(f.To)).Select(f => f.To))
            .Distinct()
            .ToListAsync();

        // 2. Filtering (Server Side)
        if (!string.IsNullOrEmpty(route))
        {
            var r = route.Trim().ToLower();
            query = query.Where(f => f.From.ToLower().Contains(r) || f.To.ToLower().Contains(r) || f.Airline.ToLower().Contains(r));
        }

        if (minPrice.HasValue) query = query.Where(f => f.Price >= (decimal)minPrice.Value);
        if (maxPrice.HasValue) query = query.Where(f => f.Price <= (decimal)maxPrice.Value);

        if (rating != null && rating.Length > 0)
        {
            var minRate = rating.Min();
            query = query.Where(f => f.Rating >= minRate);
        }

        if (airlines != null && airlines.Length > 0) query = query.Where(f => airlines.Contains(f.Airline));
        if (tripType != null && tripType.Length > 0) query = query.Where(f => tripType.Contains(f.TripType));

        // 3. Stats for UI (Cheapest, Best, Quickest)
        var allResults = await query.ToListAsync();
        if (allResults.Any())
        {
            ViewData["CheapestPrice"] = allResults.Min(f => f.Price);
            ViewData["BestPrice"] = allResults.Max(f => f.Rating);
        }

        // 4. Sorting
        query = sortOrder switch
        {
            "cheapest" => query.OrderBy(f => f.Price),
            "best" => query.OrderByDescending(f => f.Rating),
            _ => query.OrderBy(f => f.Price),
        };

        // 5. Pagination
        int pageSize = 5;
        var paginated = await PaginatedList<Flight>.CreateAsync(query, pageNumber ?? 1, pageSize);
        return View("Listing", paginated);
    }

    [HttpGet]
    public async Task<IActionResult> Details(int id)
    {
        var flight = await _context.Flights.FindAsync(id);
        if (flight == null) return NotFound();
        return View(flight);
    }

    [HttpGet]
    public async Task<IActionResult> Booking(int id)
    {
        var flight = await _context.Flights.FindAsync(id);
        if (flight == null) return NotFound();
        return View("flight-booking", flight);
    }

    [HttpGet]
    public async Task<IActionResult> Payment(int? id, bool volta = false)
    {
        string? formId = HttpContext.Request.HasFormContentType ? HttpContext.Request.Form["id"].ToString() : null;
        int flightId = id ?? (int.TryParse(formId, out int parsedId) ? parsedId : 0);
        if (flightId == 0) return NotFound();

        var flight = await _context.Flights.FindAsync(flightId);
        if (flight == null) return NotFound();

        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        ViewBag.UserCards = await _context.UserCards.Where(c => c.UserId == userId).ToListAsync();

        ViewBag.Volta = volta;
        return View("flight-payment", flight);
    }

    [HttpPost]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> CompletePayment(int flightId, string paymentType, bool volta = false)
    {
        var flight = await _context.Flights.FindAsync(flightId);
        if (flight == null) return NotFound();

        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!await _context.UserCards.AnyAsync(c => c.UserId == userId))
        {
            TempData["Error"] = "You must add a credit card to complete the purchase.";
            return RedirectToAction("Payment", new { id = flightId });
        }

        var multiplier = volta ? 2 : 1;
        var total = (flight.Price * multiplier) + (flight.Price * 0.1m * multiplier) + (25m * multiplier);

        var booking = new Booking
        {
            UserId = userId ?? "anonymous",
            UserEmail = User.FindFirstValue(ClaimTypes.Email) ?? "anonymous@email.com",
            UserName = User.Identity?.Name,
            FlightId = flightId,
            BookingDate = DateTime.Now,
            PaymentType = paymentType ?? "full",
            TotalPrice = total,
            Status = "Confirmed",
            TicketNumber = $"TKT{DateTime.Now:yyyyMMdd}{flightId:D4}{new Random().Next(1000, 9999)}",
            Gate = $"A{(flightId % 20) + 1}",
            Seat = $"{(flightId % 30) + 1}A",
            IsRoundTrip = volta
        };

        _context.Bookings.Add(booking);
        await _context.SaveChangesAsync();

        TempData["TicketId"] = booking.Id;
        return RedirectToAction("Ticket");
    }

    [HttpGet]
    public async Task<IActionResult> Ticket(int? id)
    {
        int ticketId = id ?? (TempData["TicketId"] as int? ?? 0);
        if (ticketId == 0) return NotFound();

        var booking = await _context.Bookings.Include(b => b.Flight).FirstOrDefaultAsync(b => b.Id == ticketId);
        if (booking == null)
        {
            var flight = await _context.Flights.FindAsync(ticketId);
            if (flight != null) return View("flight-ticket", flight);
            return NotFound();
        }

        return View("flight-ticket-booking", booking);
    }


    [HttpPost]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> Create([Bind("Id,Airline,Logo,From,To,Departure,Arrival,Duration,Stops,Price,Rating,Reviews,MainImage,Policies,Amenities")] Flight flight)
    {
        if (ModelState.IsValid)
        {
            _context.Add(flight);
            await _context.SaveChangesAsync();
            return RedirectToAction(nameof(Listing));
        }
        return View(flight);
    }
}
