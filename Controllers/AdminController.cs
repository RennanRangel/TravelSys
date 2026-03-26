using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;
using ProjetoHotelAviao.Data;
using ProjetoHotelAviao.Models;
using ProjetoHotelAviao.Models.ViewModels;
using System.Security.Claims;

namespace ProjetoHotelAviao.Controllers;

[Authorize(Roles = "Admin")]
public class AdminController : Controller
{
    private readonly ApplicationDbContext _context;
    private readonly UserManager<ApplicationUser> _userManager;

    public AdminController(ApplicationDbContext context, UserManager<ApplicationUser> userManager)
    {
        _context = context;
        _userManager = userManager;
    }

    public async Task<IActionResult> Index()
    {
        var flights = await _context.Flights.ToListAsync();
        var hotels = await _context.Hotels.ToListAsync();
        var bookings = await _context.Bookings.Include(b => b.Flight).OrderByDescending(b => b.BookingDate).ToListAsync();
        var hotelBookings = await _context.HotelBookings.Include(b => b.Hotel).OrderByDescending(b => b.BookingDate).ToListAsync();

        var viewModel = new AdminViewModel
        {
            Flights = flights,
            Hotels = hotels,
            RecentBookings = bookings.Take(8).ToList(),
            RecentHotelBookings = hotelBookings.Take(8).ToList(),
            TotalFlights = flights.Count,
            TotalHotels = hotels.Count,
            TotalBookings = bookings.Count + hotelBookings.Count,
            TotalRevenue = bookings.Sum(b => b.TotalPrice) + hotelBookings.Sum(b => b.TotalPrice)
        };
        return View(viewModel);
    }

    public IActionResult AdicionarAdmin()
    {
        return View();
    }

    [HttpPost]
    public async Task<IActionResult> SalvarAdmin(string firstName, string lastName, string email, string password, string phone, UserRole role)
    {
        if (string.IsNullOrEmpty(email) || string.IsNullOrEmpty(password))
        {
            TempData["ErrorMessage"] = "Email e senha são obrigatórios.";
            return RedirectToAction("GestaoUsuarios");
        }

        var existingUser = await _userManager.FindByEmailAsync(email);
        if (existingUser != null)
        {
            TempData["ErrorMessage"] = "Este email já está cadastrado.";
            return RedirectToAction("GestaoUsuarios");
        }

        var adminUser = new Administrator
        {
            UserName = email,
            Email = email,
            FirstName = firstName,
            LastName = lastName,
            Phone = phone,
            CreatedAt = DateTime.UtcNow,
            EmailConfirmed = true,
            Role = role
        };

        var result = await _userManager.CreateAsync(adminUser, password);
        if (result.Succeeded)
        {
            await _userManager.AddToRoleAsync(adminUser, "Admin");
            
            TempData["SuccessMessage"] = $"Administrador {firstName} cadastrado com sucesso na nova tabela!";
            return RedirectToAction("GestaoUsuarios");
        }

        TempData["ErrorMessage"] = "Erro ao criar administrador: " + string.Join(", ", result.Errors.Select(e => e.Description));
        return RedirectToAction("GestaoUsuarios");
    }

    [HttpGet]
    public async Task<IActionResult> GestaoUsuarios(int page = 1)
    {
        const int pageSize = 5;
        
        var totalAdmins = await _context.Administrators.CountAsync();
        var totalPages = (int)Math.Ceiling(totalAdmins / (double)pageSize);
        
        if (page < 1) page = 1;
        if (page > totalPages && totalPages > 0) page = totalPages;

        var admins = await _context.Administrators
            .OrderByDescending(a => a.CreatedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        ViewBag.CurrentPage = page;
        ViewBag.TotalPages = totalPages;

        return View(admins);
    }

    [HttpPost]
    public async Task<IActionResult> AtualizarAdmin(string userId, string firstName, string lastName, string email, string phone, UserRole role, string newPassword)
    {
        // Segurança: Apenas o Admin Master (admin@gmail.com) pode gerenciar outros admins
        if (User.Identity?.Name != "admin@gmail.com")
        {
            TempData["ErrorMessage"] = "Apenas o Admin Master tem permissão para editar outros administradores.";
            return RedirectToAction("GestaoUsuarios");
        }

        var admin = await _context.Administrators.FindAsync(userId);
        if (admin == null) return NotFound();

        if (admin.Email != email)
        {
            admin.Email = email;
            admin.UserName = email;
            admin.NormalizedEmail = email.ToUpper();
            admin.NormalizedUserName = email.ToUpper();
        }

        admin.FirstName = firstName;
        admin.LastName = lastName;
        admin.Phone = phone;
        admin.Role = role;

        var result = await _userManager.UpdateAsync(admin);
        
        if (result.Succeeded && !string.IsNullOrEmpty(newPassword))
        {
            var token = await _userManager.GeneratePasswordResetTokenAsync(admin);
            var passResult = await _userManager.ResetPasswordAsync(admin, token, newPassword);
            
            if (!passResult.Succeeded)
            {
                TempData["ErrorMessage"] = "Perfil atualizado, mas erro ao alterar senha: " + 
                                           string.Join(", ", passResult.Errors.Select(e => e.Description));
                return RedirectToAction("GestaoUsuarios");
            }
        }

        if (result.Succeeded)
        {
            TempData["SuccessMessage"] = $"Administrador {firstName} atualizado com sucesso!";
        }
        else
        {
            TempData["ErrorMessage"] = "Erro ao atualizar administrador: " + 
                                       string.Join(", ", result.Errors.Select(e => e.Description));
        }

        return RedirectToAction("GestaoUsuarios");
    }

    [HttpPost]
    public async Task<IActionResult> ExcluirUsuario(string userId)
    {
        if (User.Identity?.Name != "admin@gmail.com")
        {
            TempData["ErrorMessage"] = "Apenas o Admin Master pode excluir administradores.";
            return RedirectToAction("GestaoUsuarios");
        }

        var user = await _userManager.FindByIdAsync(userId);
        if (user == null) return NotFound();

        if (user.Email == "admin@gmail.com")
        {
            TempData["ErrorMessage"] = "O Admin Master não pode ser excluído.";
            return RedirectToAction("GestaoUsuarios");
        }

        var result = await _userManager.DeleteAsync(user);
        if (result.Succeeded)
        {
            TempData["SuccessMessage"] = "Administrador removido com sucesso.";
        }
        else
        {
            TempData["ErrorMessage"] = "Erro ao excluir administrador.";
        }

        return RedirectToAction("GestaoUsuarios");
    }

    [AllowAnonymous] 
    public async Task<IActionResult> FixDb()
    {
        var results = new List<string>();
        string[] queries = {
            "ALTER TABLE Hotels ADD COLUMN IF NOT EXISTS Region LONGTEXT NULL;",
            "ALTER TABLE Hotels ADD COLUMN IF NOT EXISTS BookingMode LONGTEXT NULL;",
            "ALTER TABLE Hotels ADD COLUMN IF NOT EXISTS CheckIn LONGTEXT NULL;",
            "ALTER TABLE Hotels ADD COLUMN IF NOT EXISTS CheckOut LONGTEXT NULL;",
            "ALTER TABLE Hotels ADD COLUMN IF NOT EXISTS ReceptionMode LONGTEXT NULL;",
            "ALTER TABLE Hotels ADD COLUMN IF NOT EXISTS ZipCode LONGTEXT NULL;",
            "ALTER TABLE Hotels ADD COLUMN IF NOT EXISTS Country LONGTEXT NULL;",
            "ALTER TABLE Hotels MODIFY COLUMN Stars INT NULL;"
        };

        foreach (var query in queries)
        {
            try
            {
                await _context.Database.ExecuteSqlRawAsync(query);
                results.Add($"Sucesso: {query}");
            }
            catch (Exception ex)
            {
                if (ex.Message.Contains("Duplicate column name") || ex.Message.Contains("already exists"))
                {
                    results.Add($"Ignorado (já existe): {query}");
                }
                else
                {
                    try 
                    {
                        var standardQuery = query.Replace("IF NOT EXISTS ", "");
                        await _context.Database.ExecuteSqlRawAsync(standardQuery);
                        results.Add($"Sucesso (Standard): {standardQuery}");
                    }
                    catch (Exception ex2)
                    {
                        results.Add($"Erro: {query} - {ex2.Message}");
                    }
                }
            }
        }
        
        return Content("Resultado da atualização:\n" + string.Join("\n", results));
    }

    public async Task<IActionResult> GestaoViagens()
    {
        var flights = await _context.Flights.ToListAsync();
        var viewModel = new AdminViewModel
        {
            Flights = flights,
            NewFlight = new Flight
            {
                Amenities = "- Wi-Fi gratuito de alta velocidade a bordo\n- Sistema de entretenimento individual de última geração\n- Refeições gourmet preparadas por chefs renomados\n- Assentos ergonômicos com maior espaço para as pernas\n- Kit de amenidades exclusivo para voos de longa distância\n- Atendimento personalizado e equipe multilíngue",
                Policies = "- Franquia de bagagem inclusa conforme a classe tarifária\n- Reembolso integral disponível para cancelamentos em até 24h\n- Taxas de alteração reduzidas para flexibilidade de datas\n- Check-in antecipado disponível via aplicativo ou totem\n- Prioridade no embarque para membros do programa de fidelidade\n- Assistência especial disponível sob solicitação prévia"
            }
        };
        return View(viewModel);
    }

    public async Task<IActionResult> GestaoHospedagens()
    {
        var hotels = await _context.Hotels.ToListAsync();
        var viewModel = new AdminViewModel
        {
            Hotels = hotels,
            NewHotel = new Hotel
            {
                Overview = "O nosso hotel é uma excelente opção para quem busca conforto e sofisticação no coração da cidade. Oferecemos quartos modernos, serviço de primeira classe e uma localização estratégica próxima aos principais pontos turísticos. Seja para viagens de negócios ou lazer, garantimos uma estadia inesquecível com atendimento personalizado.",
                Amenities = "- Piscina infinita com vista panorâmica\n- Spa de luxo e Centro de Bem-Estar\n- Academia 24h com equipamentos de ponta\n- Restaurante de Gastronomia Premiada\n- Wi-Fi de alta velocidade em todas as áreas\n- Serviço de Quarto 24h e Concierge"
            }
        };
        return View(viewModel);
    }

    public async Task<IActionResult> AnalisarDados()
    {
        var flightBookingsCount = await _context.Bookings.CountAsync();
        var hotelBookingsCount = await _context.HotelBookings.CountAsync();
        var totalBookings = flightBookingsCount + hotelBookingsCount;

        var flightRevenue = await _context.Bookings.SumAsync(b => b.TotalPrice);
        var hotelRevenue = await _context.HotelBookings.SumAsync(h => h.TotalPrice);
        var totalRevenue = flightRevenue + hotelRevenue;

        var usersCount = await _context.Users.CountAsync();

        decimal conversionRate = 0;
        if (usersCount > 0)
        {
            conversionRate = Math.Round((decimal)totalBookings / usersCount * 100, 1);
        }

        var last6Months = Enumerable.Range(0, 6)
            .Select(i => DateTime.Now.AddMonths(-i))
            .OrderBy(d => d)
            .ToList();

        var revenueByMonth = new List<RevenueDataPoint>();
        var flightBookings = await _context.Bookings.ToListAsync();
        var hotelBookings = await _context.HotelBookings.ToListAsync();

        foreach (var monthDate in last6Months)
        {
            var monthRevenue = flightBookings
                .Where(b => b.BookingDate.Month == monthDate.Month && b.BookingDate.Year == monthDate.Year)
                .Sum(b => b.TotalPrice) +
                hotelBookings
                .Where(b => b.BookingDate.Month == monthDate.Month && b.BookingDate.Year == monthDate.Year)
                .Sum(b => b.TotalPrice);

            revenueByMonth.Add(new RevenueDataPoint 
            { 
                Month = monthDate.ToString("MMM", new System.Globalization.CultureInfo("pt-BR")), 
                Revenue = monthRevenue 
            });
        }

        var bookingsByDestination = await _context.Bookings
            .Include(b => b.Flight)
            .Where(b => b.Flight != null)
            .GroupBy(b => b.Flight!.To)
            .Select(g => new DestinationDataPoint { Destination = g.Key, Count = g.Count() })
            .OrderByDescending(d => d.Count)
            .Take(5)
            .ToListAsync();

        var viewModel = new AdminViewModel
        {
            TotalBookings = totalBookings,
            TotalRevenue = totalRevenue,
            ActiveUsers = usersCount,
            ConversionRate = conversionRate,
            RevenueByMonth = revenueByMonth,
            BookingsByDestination = bookingsByDestination
        };

        return View(viewModel);
    }

    public async Task<IActionResult> Relatorios()
    {
        var flightBookings = await _context.Bookings.Include(b => b.Flight).ToListAsync();
        var hotelBookings = await _context.HotelBookings.Include(b => b.Hotel).ToListAsync();

        ViewBag.TotalFlightBookings = flightBookings.Count;
        ViewBag.TotalHotelBookings = hotelBookings.Count;
        ViewBag.FlightRevenue = flightBookings.Sum(b => b.TotalPrice);
        ViewBag.HotelRevenue = hotelBookings.Sum(b => b.TotalPrice);
        ViewBag.TotalFlights = await _context.Flights.CountAsync();
        ViewBag.TotalHotels = await _context.Hotels.CountAsync();
        ViewBag.TotalUsers = await _context.Users.CountAsync();

        return View();
    }

    public async Task<IActionResult> ExportFinanceiro()
    {
        var flightBookings = await _context.Bookings.Include(b => b.Flight).ToListAsync();
        var hotelBookings = await _context.HotelBookings.Include(b => b.Hotel).ToListAsync();

        var csv = new System.Text.StringBuilder();
        csv.AppendLine("Tipo,ID,Cliente,Email,Item,Data,Valor,Status");

        foreach (var b in flightBookings)
        {
            csv.AppendLine($"Voo,{b.Id},{b.UserName},{b.UserEmail},{b.Flight?.From} → {b.Flight?.To},{b.BookingDate:dd/MM/yyyy},{b.TotalPrice:F2},{b.Status}");
        }
        foreach (var b in hotelBookings)
        {
            csv.AppendLine($"Hotel,{b.Id},{b.UserName},{b.UserEmail},{b.Hotel?.Name},{b.BookingDate:dd/MM/yyyy},{b.TotalPrice:F2},{b.Status}");
        }

        var bytes = System.Text.Encoding.UTF8.GetBytes(csv.ToString());
        return File(bytes, "text/csv", $"relatorio-financeiro-{DateTime.Now:yyyy-MM-dd}.csv");
    }

    public async Task<IActionResult> ExportHoteis()
    {
        var hotels = await _context.Hotels.ToListAsync();
        var hotelBookings = await _context.HotelBookings.Include(b => b.Hotel).ToListAsync();

        var csv = new System.Text.StringBuilder();
        csv.AppendLine("ID,Nome,Localização,Estrelas,Preço,Status,Total Reservas,Receita Total");

        foreach (var h in hotels)
        {
            var bookings = hotelBookings.Where(b => b.HotelId == h.Id).ToList();
            csv.AppendLine($"{h.Id},{h.Name},{h.Location},{h.Stars},{h.Price:F2},{h.Status},{bookings.Count},{bookings.Sum(b => b.TotalPrice):F2}");
        }

        var bytes = System.Text.Encoding.UTF8.GetBytes(csv.ToString());
        return File(bytes, "text/csv", $"relatorio-hoteis-{DateTime.Now:yyyy-MM-dd}.csv");
    }

    public async Task<IActionResult> ExportVoos()
    {
        var flights = await _context.Flights.ToListAsync();
        var flightBookings = await _context.Bookings.Include(b => b.Flight).ToListAsync();

        var csv = new System.Text.StringBuilder();
        csv.AppendLine("ID,Origem,Destino,Companhia,Preço,Status,Total Reservas,Receita Total");

        foreach (var f in flights)
        {
            var bookings = flightBookings.Where(b => b.FlightId == f.Id).ToList();
            csv.AppendLine($"{f.Id},{f.From},{f.To},{f.Airline},{f.Price:F2},{f.Status},{bookings.Count},{bookings.Sum(b => b.TotalPrice):F2}");
        }

        var bytes = System.Text.Encoding.UTF8.GetBytes(csv.ToString());
        return File(bytes, "text/csv", $"relatorio-voos-{DateTime.Now:yyyy-MM-dd}.csv");
    }

    public async Task<IActionResult> GerenciarTarefas()
    {
        try {
            await _context.Database.ExecuteSqlRawAsync(@"
                CREATE TABLE IF NOT EXISTS AdminTasks (
                    Id INT AUTO_INCREMENT PRIMARY KEY,
                    Title LONGTEXT NOT NULL,
                    Description LONGTEXT NULL,
                    Status LONGTEXT NOT NULL,
                    Priority LONGTEXT NOT NULL,
                    AssignedTo LONGTEXT NULL,
                    CreatedAt DATETIME(6) NOT NULL,
                    CompletedAt DATETIME(6) NULL
                );
            ");
        } catch { }

        var tasks = await _context.AdminTasks.OrderByDescending(t => t.CreatedAt).ToListAsync();
        return View(tasks);
    }

    [HttpPost]
    public async Task<IActionResult> CreateTask([FromBody] AdminTask task)
    {
        if (string.IsNullOrEmpty(task.Title))
            return BadRequest("Título é obrigatório");

        task.CreatedAt = DateTime.Now;
        _context.AdminTasks.Add(task);
        await _context.SaveChangesAsync();
        return Json(new { success = true, id = task.Id });
    }

    [HttpPost]
    public async Task<IActionResult> UpdateTaskStatus([FromBody] UpdateTaskRequest request)
    {
        var task = await _context.AdminTasks.FindAsync(request.Id);
        if (task == null) return NotFound();

        task.Status = request.Status;
        if (request.Status == "concluido")
            task.CompletedAt = DateTime.Now;
        else
            task.CompletedAt = null;

        await _context.SaveChangesAsync();
        return Json(new { success = true });
    }

    [HttpPost]
    public async Task<IActionResult> DeleteTask([FromBody] DeleteTaskRequest request)
    {
        var task = await _context.AdminTasks.FindAsync(request.Id);
        if (task == null) return NotFound();

        _context.AdminTasks.Remove(task);
        await _context.SaveChangesAsync();
        return Json(new { success = true });
    }

    public class UpdateTaskRequest
    {
        public int Id { get; set; }
        public string Status { get; set; } = string.Empty;
    }

    public class DeleteTaskRequest
    {
        public int Id { get; set; }
    }

    [HttpGet]
    public IActionResult CreateFlight()
    {
        var viewModel = new AdminViewModel
        {
            NewFlight = new Flight
            {
                Amenities = "- Wi-Fi gratuito de alta velocidade a bordo\n- Sistema de entretenimento individual de última geração\n- Refeições gourmet preparadas por chefs renomados\n- Assentos ergonômicos com maior espaço para as pernas\n- Kit de amenidades exclusivo para voos de longa distância\n- Atendimento personalizado e equipe multilíngue",
                Policies = "- Franquia de bagagem inclusa conforme a classe tarifária\n- Reembolso integral disponível para cancelamentos em até 24h\n- Taxas de alteração reduzidas para flexibilidade de datas\n- Check-in antecipado disponível via aplicativo ou totem\n- Prioridade no embarque para membros do programa de fidelidade\n- Assistência especial disponível sob solicitação prévia"
            }
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

            var prices = new List<decimal>();
            if (model.NewFlight.EconomyPrice.HasValue) prices.Add(model.NewFlight.EconomyPrice.Value);
            if (model.NewFlight.BusinessPrice.HasValue) prices.Add(model.NewFlight.BusinessPrice.Value);
            if (model.NewFlight.FirstClassPrice.HasValue) prices.Add(model.NewFlight.FirstClassPrice.Value);
            model.NewFlight.Price = prices.Any() ? prices.Min() : 0;
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

        ModelState.Remove("NewHotel.Rating");
        ModelState.Remove("NewHotel.Reviews");
        ModelState.Remove("NewFlight.Rating");
        ModelState.Remove("NewFlight.Reviews");
        ModelState.Remove("NewFlight.Logo"); 
        ModelState.Remove("NewFlight.MainImage"); 
       
        foreach (var key in ModelState.Keys.Where(k => k.StartsWith("NewHotel")))
        {
            ModelState.Remove(key);
        }

        if (ModelState.IsValid)
        {
            _context.Flights.Add(model.NewFlight);
            await _context.SaveChangesAsync();
            return RedirectToAction(nameof(GestaoViagens));
        }

       
        model.Flights = await _context.Flights.ToListAsync();
        return View("GestaoViagens", model);
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
        return RedirectToAction(nameof(GestaoViagens));
    }

    [HttpPost]
    public async Task<IActionResult> DeleteMassFlight([FromBody] List<int> ids)
    {
        var flights = await _context.Flights.Where(f => ids.Contains(f.Id)).ToListAsync();
        _context.Flights.RemoveRange(flights);
        await _context.SaveChangesAsync();
        return Ok();
    }

    [HttpGet]
    public IActionResult CreateHotel()
    {
        var viewModel = new AdminViewModel
        {
            NewHotel = new Hotel
            {
                Overview = "O nosso hotel é uma excelente opção para quem busca conforto e sofisticação no coração da cidade. Oferecemos quartos modernos, serviço de primeira classe e uma localização estratégica próxima aos principais pontos turísticos. Seja para viagens de negócios ou lazer, garantimos uma estadia inesquecível com atendimento personalizado.",
                Amenities = "- Piscina infinita com vista panorâmica\n- Spa de luxo e Centro de Bem-Estar\n- Academia 24h com equipamentos de ponta\n- Restaurante de Gastronomia Premiada\n- Wi-Fi de alta velocidade em todas as áreas\n- Serviço de Quarto 24h e Concierge"
            }
        };
        return View(viewModel);
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

        ModelState.Remove("NewHotel.Stars");
        ModelState.Remove("NewHotel.Rating");
        ModelState.Remove("NewHotel.Reviews");
        ModelState.Remove("NewHotel.Logo"); 

        if (ModelState.IsValid)
        {
            _context.Hotels.Add(model.NewHotel);
            await _context.SaveChangesAsync();
            return RedirectToAction(nameof(GestaoHospedagens));
        }

        model.Hotels = await _context.Hotels.ToListAsync();
        return View("GestaoHospedagens", model);
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
        return RedirectToAction(nameof(GestaoHospedagens));
    }

    [HttpPost]
    public async Task<IActionResult> DeleteMassHotel([FromBody] List<int> ids)
    {
        var hotels = await _context.Hotels.Where(h => ids.Contains(h.Id)).ToListAsync();
        _context.Hotels.RemoveRange(hotels);
        await _context.SaveChangesAsync();
        return Ok();
    }

    
    [HttpGet]
    public async Task<IActionResult> EditFlight(int? id)
    {
        if (id == null || id == 0) return NotFound();

        var flight = await _context.Flights.FindAsync(id);
        if (flight == null) return NotFound();

        return View(flight);
    }

    
    [HttpPost]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> UpdateFlight(int id, [Bind("Id,Airline,Logo,From,To,Departure,Arrival,Duration,Stops,Price,MainImage,Policies,Amenities,GalleryImages,LogoUpload,MainImageUpload,GalleryImagesUpload,ImagesToDelete,TripType,FlightClasses,EconomyPrice,BusinessPrice,FirstClassPrice,Status,IsAccessible,Terminal,Frequency")] Flight flight)
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

        var prices = new List<decimal>();
        if (flight.EconomyPrice.HasValue) prices.Add(flight.EconomyPrice.Value);
        if (flight.BusinessPrice.HasValue) prices.Add(flight.BusinessPrice.Value);
        if (flight.FirstClassPrice.HasValue) prices.Add(flight.FirstClassPrice.Value);
        flight.Price = prices.Any() ? prices.Min() : 0;

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
            return RedirectToAction(nameof(GestaoViagens));
        }
        return View(flight);
    }

    
    [HttpGet]
    public async Task<IActionResult> EditHotel(int? id)
    {
        if (id == null || id == 0) return NotFound();

        var hotel = await _context.Hotels.FindAsync(id);
        if (hotel == null) return NotFound();

        return View(hotel);
    }

    
    [HttpPost]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> UpdateHotel(int id, [Bind("Id,Name,Type,Location,Overview,MapUrl,MainImage,GalleryImages,Price,Amenities,Region,BookingMode,CheckIn,CheckOut,ReceptionMode,ZipCode,Country,MainImageUpload,GalleryImagesUpload,ImagesToDelete,IsAccessible")] Hotel hotel)
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
            return RedirectToAction(nameof(GestaoHospedagens));
        }
        return View(hotel);
    }
}
