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

    [Authorize]
    [Authorize]
    [Authorize]
    public async Task<IActionResult> Index(string sortOrder, int? pageNumber, int? minPrice, int? maxPrice, int? minTime, int? maxTime, int[] rating, string[] airlines, string[] tripType, string? route)
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
        
        var flights = await _context.Flights.ToListAsync();

        var cities = await _context.Flights
            .Where(f => !string.IsNullOrEmpty(f.From))
            .Select(f => f.From)
            .Union(_context.Flights.Where(f => !string.IsNullOrEmpty(f.To)).Select(f => f.To))
            .Distinct()
            .ToListAsync();
            
        var routes = await _context.Flights
            .Where(f => !string.IsNullOrEmpty(f.From) && !string.IsNullOrEmpty(f.To))
            .Select(f => f.From + " - " + f.To)
            .Distinct()
            .ToListAsync();
            
        cities.AddRange(routes);
        ViewData["AvailableCities"] = cities.Distinct().ToList();

        if (!string.IsNullOrEmpty(route))
        {
            var trimmedRoute = route.Trim().ToLower();
            var parts = trimmedRoute.Split(new[] { '-', '–', '—' }, StringSplitOptions.TrimEntries);
            
            if (parts.Length == 2)
            {
                var fromCity = parts[0];
                var toCity = parts[1];
                flights = flights.Where(f => 
                    ((f.From ?? "").Trim().ToLower().Contains(fromCity) && (f.To ?? "").Trim().ToLower().Contains(toCity)) ||
                    ((f.From ?? "").Trim().ToLower().Contains(toCity) && (f.To ?? "").Trim().ToLower().Contains(fromCity))
                ).ToList();
            }
            else
            {
                flights = flights.Where(f => 
                    (f.From ?? "").Trim().ToLower().Contains(trimmedRoute) || 
                    (f.To ?? "").Trim().ToLower().Contains(trimmedRoute) ||
                    (f.Airline ?? "").Trim().ToLower().Contains(trimmedRoute)
                ).ToList();
            }
        }

        if (minPrice.HasValue)
        {
            flights = flights.Where(f => f.Price >= (decimal)minPrice.Value).ToList();
        }
        if (maxPrice.HasValue)
        {
            flights = flights.Where(f => f.Price <= (decimal)maxPrice.Value).ToList();
        }

        if (minTime.HasValue || maxTime.HasValue)
        {
            var minHour = minTime ?? 0;
            var maxHour = maxTime ?? 24;

            flights = flights.Where(f => 
            {
                if (DateTime.TryParse(f.Departure, out DateTime dt))
                {
                    var hour = dt.Hour;
                    return hour >= minHour && hour <= maxHour;
                }
                return true;
            }).ToList();
        }

        if (rating != null && rating.Length > 0)
        {
            var minRating = rating.Min();
            flights = flights.Where(f => f.Rating >= minRating).ToList();
        }

        if (airlines != null && airlines.Length > 0)
        {
            flights = flights.Where(f => airlines.Contains(f.Airline)).ToList();
        }

        if (tripType != null && tripType.Length > 0)
        {
            var validTripTypes = tripType.Where(t => !string.IsNullOrEmpty(t)).ToArray();
            if (validTripTypes.Length > 0)
            {
                flights = flights.Where(f => validTripTypes.Contains(f.TripType)).ToList();
            }
        }

        
        var cheapestFlight = flights.OrderBy(f => f.Price).FirstOrDefault();
        var bestFlight = flights.OrderByDescending(f => f.Rating).ThenBy(f => f.Price).FirstOrDefault(); 
       
        var quickestFlight = flights.OrderBy(f =>
        {
            var parts = f.Duration.Split(' ');
            int minutes = 0;
            foreach (var part in parts)
            {
                if (part.EndsWith("h")) minutes += int.Parse(part.TrimEnd('h')) * 60;
                if (part.EndsWith("m")) minutes += int.Parse(part.TrimEnd('m'));
            }
            return minutes;
        }).FirstOrDefault();

     
        ViewData["CheapestPrice"] = cheapestFlight?.Price ?? 0;
        ViewData["CheapestDuration"] = cheapestFlight?.Duration ?? "--";

        ViewData["BestPrice"] = bestFlight?.Price ?? 0;
        ViewData["BestDuration"] = bestFlight?.Duration ?? "--";

        ViewData["QuickestPrice"] = quickestFlight?.Price ?? 0;
        ViewData["QuickestDuration"] = quickestFlight?.Duration ?? "--";

        switch (sortOrder)
        {
            case "cheapest":
                flights = flights.OrderBy(f => f.Price).ToList();
                break;
            case "best":
                flights = flights.OrderByDescending(f => f.Rating).ToList();
                break;
            case "quickest":
                flights = flights.OrderBy(f =>
                {
                   
                    var parts = f.Duration.Split(' ');
                    int minutes = 0;
                    foreach (var part in parts)
                    {
                        if (part.EndsWith("h")) minutes += int.Parse(part.TrimEnd('h')) * 60;
                        if (part.EndsWith("m")) minutes += int.Parse(part.TrimEnd('m'));
                    }
                    return minutes;
                }).ToList();
                break;
            default:
                flights = flights.OrderBy(f => f.Price).ToList(); 
                break;
        }
        
        int pageSize = 5;
        return View(PaginatedList<Flight>.Create(flights, pageNumber ?? 1, pageSize));
    }

    [AcceptVerbs("Get", "Post")]
    public async Task<IActionResult> Details(int id)
    {
        var flight = await _context.Flights.FindAsync(id);
        if (flight == null)
        {
            return NotFound();
        }
        return View(flight);
    }

    public IActionResult Create()
    {
        return View();
    }

    [AcceptVerbs("Get", "Post")]
    public async Task<IActionResult> Booking(int id)
    {
        var flight = await _context.Flights.FindAsync(id);
        if (flight == null)
        {
            return NotFound();
        }
        return View("flight-booking", flight);
    }

    [AcceptVerbs("Get", "Post")]
    public async Task<IActionResult> Payment(int? id)
    {
        try 
        {
            Console.WriteLine($"[DEBUG] Payment Action called. Method: {HttpContext.Request.Method}, ID: {id}");
            
           
            if ((id == null || id == 0) && HttpContext.Request.Method == "POST" && HttpContext.Request.HasFormContentType && HttpContext.Request.Form.ContainsKey("id"))
            {
                 if (int.TryParse(HttpContext.Request.Form["id"], out int parsedId))
                 {
                     id = parsedId;
                     Console.WriteLine($"[DEBUG] ID manually recovered from Form: {id}");
                 }
            }

            if (id == null || id == 0)
            {
                 Console.WriteLine("[DEBUG] ID missing for Payment.");
                 return NotFound();
            }

            var flight = await _context.Flights.FindAsync(id);
            if (flight == null)
            {
                Console.WriteLine($"[DEBUG] Flight NOT FOUND for ID: {id}");
                return NotFound();
            }
           
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            
            ViewBag.UserCards = await _context.UserCards
                .Where(c => c.UserId == userId)
                .ToListAsync();

            return View("flight-payment", flight);
        }
        catch (Exception ex)
        {
            Console.WriteLine($"[ERROR] Exception in Payment action: {ex.Message}");
            Console.WriteLine($"[ERROR] StackTrace: {ex.StackTrace}");
         
            return Content($"ERROR in Payment Action: {ex.Message}\nStack Trace:\n{ex.StackTrace}"); 
        }
    }

    
    [HttpPost]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> CompletePayment(int flightId, string paymentType)
    {
        var flight = await _context.Flights.FindAsync(flightId);
        if (flight == null)
        {
            return NotFound();
        }

        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!await _context.UserCards.AnyAsync(c => c.UserId == userId))
        {
            TempData["Error"] = "You must add a credit card to complete the purchase.";
            return RedirectToAction("Payment", new { id = flightId });
        }

        
        var baseFare = flight.Price;
        var taxes = baseFare * 0.1m;
        var serviceFee = 25m;
        var total = baseFare + taxes + serviceFee;

        
        var booking = new Booking
        {
            UserId = User.FindFirstValue(ClaimTypes.NameIdentifier) ?? User.Identity?.Name ?? "anonymous",
            UserEmail = User.FindFirstValue(ClaimTypes.Email) ?? User.Identity?.Name ?? "anonymous@email.com",
            UserName = User.Identity?.Name,
            FlightId = flightId,
            BookingDate = DateTime.Now,
            PaymentType = paymentType ?? "full",
            TotalPrice = total,
            Status = "Confirmed",
            TicketNumber = $"TKT{DateTime.Now:yyyyMMdd}{flightId:D4}{new Random().Next(1000, 9999)}",
            Gate = $"A{(flightId % 20) + 1}",
            Seat = $"{(flightId % 30) + 1}A"
        };

        _context.Bookings.Add(booking);
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

        var booking = await _context.Bookings
            .Include(b => b.Flight)
            .FirstOrDefaultAsync(b => b.Id == id.Value);
        
        if (booking == null)
        {
            
            var flight = await _context.Flights.FindAsync(id.Value);
            if (flight != null)
            {
                return View("flight-ticket", flight);
            }
            return NotFound();
        }

        return View("flight-ticket-booking", booking);
    }

    
    [Authorize]
    public async Task<IActionResult> MyTickets()
    {
        var userEmail = User.Identity?.Name;
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier) ?? userEmail;

        var bookings = await _context.Bookings
            .Include(b => b.Flight)
            .Where(b => b.UserId == userId || b.UserEmail == userEmail)
            .OrderByDescending(b => b.BookingDate)
            .ToListAsync();

        return View(bookings);
    }

    
    [HttpPost]
    [Authorize]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> DeleteTicket(int id)
    {
        var userEmail = User.Identity?.Name;
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier) ?? userEmail;

        var booking = await _context.Bookings
            .FirstOrDefaultAsync(b => b.Id == id && (b.UserId == userId || b.UserEmail == userEmail));

        if (booking != null)
        {
            _context.Bookings.Remove(booking);
            await _context.SaveChangesAsync();
        }

        return RedirectToAction("MyTickets");
    }

    
    [HttpPost]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> Create([Bind("Id,Airline,Logo,From,To,Departure,Arrival,Duration,Stops,Price,Rating,Reviews,MainImage,Policies,Amenities")] Flight flight)
    {
        if (ModelState.IsValid)
        {
            _context.Add(flight);
            await _context.SaveChangesAsync();
            return RedirectToAction(nameof(Index));
        }
        return View(flight);
    }
}
