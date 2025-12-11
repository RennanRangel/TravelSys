using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ProjetoHotelAviao.Data;
using ProjetoHotelAviao.Models;
using ProjetoHotelAviao.Models.ViewModels;
using System.Security.Claims;

namespace ProjetoHotelAviao.Controllers;

[Authorize(Roles = "Admin")]
public class AdminController : Controller
{
    private readonly ApplicationDbContext _context;

    public AdminController(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<IActionResult> Index()
    {
        var viewModel = new AdminViewModel
        {
            Flights = await _context.Flights.ToListAsync(),
            Hotels = await _context.Hotels.ToListAsync()
        };
        return View(viewModel);
    }

    [HttpPost]
    public async Task<IActionResult> CreateFlight(AdminViewModel model)
    {
        
        model.NewFlight ??= new Flight();
        if (model.NewFlight != null)
        {
            model.NewFlight.Airline = model.NewFlight.Airline?.Trim() ?? string.Empty;
            model.NewFlight.From = model.NewFlight.From?.Trim() ?? string.Empty;
            model.NewFlight.To = model.NewFlight.To?.Trim() ?? string.Empty;
            model.NewFlight.Departure = model.NewFlight.Departure?.Trim() ?? string.Empty;
            model.NewFlight.Arrival = model.NewFlight.Arrival?.Trim() ?? string.Empty;
        }

        if (model.FlightLogoUpload != null)
        {
            var fileName = Path.GetFileName(model.FlightLogoUpload.FileName);
            var uniqueFileName = Guid.NewGuid().ToString() + "_" + fileName;
            var uploads = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot/images/uploads");
            if (!Directory.Exists(uploads)) Directory.CreateDirectory(uploads);
            
            var filePath = Path.Combine(uploads, uniqueFileName);
            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await model.FlightLogoUpload.CopyToAsync(stream);
            }
            model.NewFlight!.Logo = "/images/uploads/" + uniqueFileName;
    
            ModelState.Remove("NewFlight.Logo"); 
        }

    
        if (model.FlightMainImageUpload != null)
        {
            var fileName = Path.GetFileName(model.FlightMainImageUpload.FileName);
            var uniqueFileName = Guid.NewGuid().ToString() + "_" + fileName;
            var uploads = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot/images/uploads");
            if (!Directory.Exists(uploads)) Directory.CreateDirectory(uploads);
            
            var filePath = Path.Combine(uploads, uniqueFileName);
            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await model.FlightMainImageUpload.CopyToAsync(stream);
            }
            model.NewFlight!.MainImage = "/images/uploads/" + uniqueFileName;
        }

    
        if (model.NewFlight!.GalleryImagesUpload != null && model.NewFlight.GalleryImagesUpload.Count > 7)
        {
            ModelState.AddModelError("NewFlight.GalleryImagesUpload", "You can only upload a maximum of 7 images.");
        }
        if (model.NewFlight.GalleryImagesUpload != null && model.NewFlight.GalleryImagesUpload.Count > 0 && ModelState.IsValid)
        {
            var galleryPaths = new List<string>();
            var uploads = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot/images/uploads");
            if (!Directory.Exists(uploads)) Directory.CreateDirectory(uploads);

            foreach (var file in model.NewFlight.GalleryImagesUpload)
            {
                var fileName = Path.GetFileName(file.FileName);
                var uniqueFileName = Guid.NewGuid().ToString() + "_" + fileName;
                var filePath = Path.Combine(uploads, uniqueFileName);
                
                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await file.CopyToAsync(stream);
                }
                galleryPaths.Add("/images/uploads/" + uniqueFileName);
            }
            model.NewFlight.GalleryImages = System.Text.Json.JsonSerializer.Serialize(galleryPaths);
        }

        ModelState.Remove("NewHotel.Name");
        ModelState.Remove("NewHotel.Location");
        ModelState.Remove("NewHotel.Stars");
        ModelState.Remove("NewHotel.Price");
        ModelState.Remove("NewHotel.Rating");
        ModelState.Remove("NewHotel.Reviews");
       
        foreach (var key in ModelState.Keys.Where(k => k.StartsWith("NewHotel")))
        {
            ModelState.Remove(key);
        }

        if (ModelState.IsValid)
        {
            _context.Flights.Add(model.NewFlight);
            await _context.SaveChangesAsync();
            return RedirectToAction("Index", "Flights");
        }

       
        model.Flights = await _context.Flights.ToListAsync();
        model.Hotels = await _context.Hotels.ToListAsync();
        return View("Index", model);
    }

    [HttpPost]
    public async Task<IActionResult> DeleteFlight(int id)
    {
        var flight = await _context.Flights.FindAsync(id);
        if (flight != null)
        {
            _context.Flights.Remove(flight);
            await _context.SaveChangesAsync();
        }
        return RedirectToAction(nameof(Index));
    }

    [HttpPost]
    public async Task<IActionResult> CreateHotel(AdminViewModel model)
    {
        if (model.HotelMainImageUpload != null)
        {
            var fileName = Path.GetFileName(model.HotelMainImageUpload.FileName);
            var uniqueFileName = Guid.NewGuid().ToString() + "_" + fileName;
            var uploads = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot/images/uploads");
            if (!Directory.Exists(uploads)) Directory.CreateDirectory(uploads);
            
            var filePath = Path.Combine(uploads, uniqueFileName);
            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await model.HotelMainImageUpload.CopyToAsync(stream);
            }
            model.NewHotel.MainImage = "/images/uploads/" + uniqueFileName;
        }

        if (model.NewHotel.GalleryImagesUpload != null && model.NewHotel.GalleryImagesUpload.Count > 0)
        {
            var galleryPaths = new List<string>();
            var uploads = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot/images/uploads");
            if (!Directory.Exists(uploads)) Directory.CreateDirectory(uploads);

            foreach (var file in model.NewHotel.GalleryImagesUpload)
            {
                var fileName = Path.GetFileName(file.FileName);
                var uniqueFileName = Guid.NewGuid().ToString() + "_" + fileName;
                var filePath = Path.Combine(uploads, uniqueFileName);
                
                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await file.CopyToAsync(stream);
                }
                galleryPaths.Add("/images/uploads/" + uniqueFileName);
            }
            model.NewHotel.GalleryImages = System.Text.Json.JsonSerializer.Serialize(galleryPaths);
        }
      
        foreach (var key in ModelState.Keys.Where(k => k.StartsWith("NewFlight")))
        {
            ModelState.Remove(key);
        }

        if (ModelState.IsValid)
        {
            _context.Hotels.Add(model.NewHotel);
            await _context.SaveChangesAsync();
            return RedirectToAction(nameof(Index));
        }

        model.Flights = await _context.Flights.ToListAsync();
        model.Hotels = await _context.Hotels.ToListAsync();
        return View("Index", model);
    }

    [HttpPost]
    public async Task<IActionResult> DeleteHotel(int id)
    {
        var hotel = await _context.Hotels.FindAsync(id);
        if (hotel != null)
        {
            _context.Hotels.Remove(hotel);
            await _context.SaveChangesAsync();
        }
        return RedirectToAction(nameof(Index));
    }

    
    [AcceptVerbs("Get", "Post")]
    public async Task<IActionResult> EditFlight(int? id)
    {
        if (id == null || id == 0)
        {
            if (HttpContext.Request.Method == "POST" && HttpContext.Request.Form.ContainsKey("id"))
            {
                if (int.TryParse(HttpContext.Request.Form["id"], out int formId))
                {
                    id = formId;
                }
            }
        }

        if (id == null || id == 0) return NotFound();

        var flight = await _context.Flights.FindAsync(id);
        if (flight == null)
        {
            return NotFound();
        }
        return View(flight);
    }

    
    [HttpPost]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> UpdateFlight(int id, [Bind("Id,Airline,Logo,From,To,Departure,Arrival,Duration,Stops,Price,Rating,Reviews,MainImage,Policies,Amenities,GalleryImages,LogoUpload,MainImageUpload,GalleryImagesUpload,ImagesToDelete,TripType")] Flight flight)
    {
        if (id != flight.Id)
        {
            return NotFound();
        }

        flight.Airline = flight.Airline?.Trim() ?? string.Empty;
        flight.From = flight.From?.Trim() ?? string.Empty;
        flight.To = flight.To?.Trim() ?? string.Empty;
        flight.Departure = flight.Departure?.Trim() ?? string.Empty;
        flight.Arrival = flight.Arrival?.Trim() ?? string.Empty;

        if (flight.LogoUpload != null)
        {
            var fileName = Path.GetFileName(flight.LogoUpload.FileName);
            var uniqueFileName = Guid.NewGuid().ToString() + "_" + fileName;
            var uploads = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot/images/uploads");
            if (!Directory.Exists(uploads)) Directory.CreateDirectory(uploads);
            
            var filePath = Path.Combine(uploads, uniqueFileName);
            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await flight.LogoUpload.CopyToAsync(stream);
            }
            flight.Logo = "/images/uploads/" + uniqueFileName;
            ModelState.Remove("Logo");
        }

        
        if (flight.MainImageUpload != null)
        {
            var fileName = Path.GetFileName(flight.MainImageUpload.FileName);
            var uniqueFileName = Guid.NewGuid().ToString() + "_" + fileName;
            var uploads = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot/images/uploads");
            if (!Directory.Exists(uploads)) Directory.CreateDirectory(uploads);
            
            var filePath = Path.Combine(uploads, uniqueFileName);
            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await flight.MainImageUpload.CopyToAsync(stream);
            }
            flight.MainImage = "/images/uploads/" + uniqueFileName;
        }

      
        var galleryPaths = new List<string>();
        
      
        if (!string.IsNullOrEmpty(flight.GalleryImages))
        {
            try 
            {
                var existing = System.Text.Json.JsonSerializer.Deserialize<List<string>>(flight.GalleryImages);
                if (existing != null) galleryPaths.AddRange(existing);
            } 
            catch { }
        }

      
        if (flight.ImagesToDelete != null && flight.ImagesToDelete.Count > 0)
        {
            foreach (var imgToDelete in flight.ImagesToDelete)
            {
                galleryPaths.Remove(imgToDelete);
                
            }
        }

      
        if (flight.GalleryImagesUpload != null && flight.GalleryImagesUpload.Count > 0)
        {
             
            if (galleryPaths.Count + flight.GalleryImagesUpload.Count > 7)
            {
                ModelState.AddModelError("GalleryImagesUpload", "Total gallery images cannot exceed 7. Please delete more images or upload fewer.");
            }
            else
            {
                var uploads = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot/images/uploads");
                if (!Directory.Exists(uploads)) Directory.CreateDirectory(uploads);

                foreach (var file in flight.GalleryImagesUpload)
                {
                    var fileName = Path.GetFileName(file.FileName);
                    var uniqueFileName = Guid.NewGuid().ToString() + "_" + fileName;
                    var filePath = Path.Combine(uploads, uniqueFileName);
                    
                    using (var stream = new FileStream(filePath, FileMode.Create))
                    {
                        await file.CopyToAsync(stream);
                    }
                    galleryPaths.Add("/images/uploads/" + uniqueFileName);
                }
            }
        }
        
      
        if (ModelState.IsValid)
        {
             flight.GalleryImages = System.Text.Json.JsonSerializer.Serialize(galleryPaths);
        }

        if (ModelState.IsValid)
        {
            try
            {
                _context.Update(flight);
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!await _context.Flights.AnyAsync(e => e.Id == id))
                {
                    return NotFound();
                }
                throw;
            }
            return RedirectToAction(nameof(Index));
        }
        return View(flight);
    }

    
    [AcceptVerbs("Get", "Post")]
    public async Task<IActionResult> EditHotel(int? id)
    {
        if (id == null || id == 0)
        {
            if (HttpContext.Request.Method == "POST" && HttpContext.Request.Form.ContainsKey("id"))
            {
                if (int.TryParse(HttpContext.Request.Form["id"], out int formId))
                {
                    id = formId;
                }
            }
        }

        if (id == null || id == 0) return NotFound();

        var hotel = await _context.Hotels.FindAsync(id);
        if (hotel == null)
        {
            return NotFound();
        }
        return View(hotel);
    }

    
    [HttpPost]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> UpdateHotel(int id, [Bind("Id,Name,Type,Location,Overview,MapUrl,MainImage,GalleryImages,Stars,Price,Rating,Reviews,Amenities,MainImageUpload,GalleryImagesUpload,ImagesToDelete")] Hotel hotel)
    {
        if (id != hotel.Id)
        {
            return NotFound();
        }

      
        if (hotel.MainImageUpload != null)
        {
            var fileName = Path.GetFileName(hotel.MainImageUpload.FileName);
            var uniqueFileName = Guid.NewGuid().ToString() + "_" + fileName;
            var uploads = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot/images/uploads");
            if (!Directory.Exists(uploads)) Directory.CreateDirectory(uploads);
            
            var filePath = Path.Combine(uploads, uniqueFileName);
            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await hotel.MainImageUpload.CopyToAsync(stream);
            }
            hotel.MainImage = "/images/uploads/" + uniqueFileName;
        }

        
        var galleryPaths = new List<string>();
        if (!string.IsNullOrEmpty(hotel.GalleryImages))
        {
            try 
            {
                var existing = System.Text.Json.JsonSerializer.Deserialize<List<string>>(hotel.GalleryImages);
                if (existing != null) galleryPaths.AddRange(existing);
            } 
            catch { }
        }

        if (hotel.ImagesToDelete != null && hotel.ImagesToDelete.Count > 0)
        {
            foreach (var imgToDelete in hotel.ImagesToDelete)
            {
                galleryPaths.Remove(imgToDelete);
            }
        }

        if (hotel.GalleryImagesUpload != null && hotel.GalleryImagesUpload.Count > 0)
        {
            var uploads = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot/images/uploads");
            if (!Directory.Exists(uploads)) Directory.CreateDirectory(uploads);

            foreach (var file in hotel.GalleryImagesUpload)
            {
                var fileName = Path.GetFileName(file.FileName);
                var uniqueFileName = Guid.NewGuid().ToString() + "_" + fileName;
                var filePath = Path.Combine(uploads, uniqueFileName);
                
                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await file.CopyToAsync(stream);
                }
                galleryPaths.Add("/images/uploads/" + uniqueFileName);
            }
        }
        hotel.GalleryImages = System.Text.Json.JsonSerializer.Serialize(galleryPaths);

        if (ModelState.IsValid)
        {
            try
            {
                _context.Update(hotel);
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!_context.Hotels.Any(e => e.Id == id))
                {
                    return NotFound();
                }
                throw;
            }
            return RedirectToAction(nameof(Index));
        }
        return View(hotel);
    }
}
