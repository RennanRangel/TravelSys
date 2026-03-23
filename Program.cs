using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;
using ProjetoHotelAviao.Data;
using ProjetoHotelAviao.Models;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllersWithViews();

builder.Services.AddControllers();

string mySqlConnection = builder.Configuration.GetConnectionString("DefaultDatabase") 
    ?? throw new InvalidOperationException("Connection string 'DefaultDatabase' not found.");
builder.Services.AddDbContext<ApplicationDbContext>(opt => {
    opt.UseMySql(mySqlConnection, ServerVersion.AutoDetect(mySqlConnection));
});

// Configure ASP.NET Core Identity with ApplicationUser
builder.Services.AddIdentity<ApplicationUser, IdentityRole>(options =>
{
    // Password settings
    options.Password.RequireDigit = false;
    options.Password.RequireLowercase = false;
    options.Password.RequireUppercase = false;
    options.Password.RequireNonAlphanumeric = false;
    options.Password.RequiredLength = 6;
    
    // User settings
    options.User.RequireUniqueEmail = true;
    
    // SignIn settings
    options.SignIn.RequireConfirmedEmail = false;
})
.AddEntityFrameworkStores<ApplicationDbContext>()
.AddDefaultTokenProviders();

builder.Services.ConfigureApplicationCookie(options => {
    options.LoginPath = "/Account/Login";
    options.LogoutPath = "/Account/Logout";
    options.AccessDeniedPath = "/Account/AccessDenied";
    options.ExpireTimeSpan = TimeSpan.FromDays(30);
    options.SlidingExpiration = true;
});

builder.Services.AddSession(options =>
{
    options.IdleTimeout = TimeSpan.FromMinutes(30);
    options.Cookie.HttpOnly = true;
    options.Cookie.IsEssential = true;
});

var app = builder.Build();

app.UseDeveloperExceptionPage();
/*
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");
    app.UseHsts();
    app.UseHttpsRedirection();
}
*/

app.UseStaticFiles();

app.UseRouting();

app.UseAuthentication();
app.UseAuthorization();

app.UseSession();

app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}");

// Initialize database and seed data
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;

    // FORCED DB FIX - Comprehensive Repair
    Console.WriteLine(">>> STARTING COMPREHENSIVE DB REPAIR <<<");
    try {
        using (var conn = new MySqlConnector.MySqlConnection(mySqlConnection))
        {
            await conn.OpenAsync();
            
            // 1. Repair HOTELS
            string[] hotelCols = { 
                "Region", "BookingMode", "CheckIn", "CheckOut", "ReceptionMode", 
                "ZipCode", "Country", "Status", "Type", "Overview", "MapUrl", 
                "GalleryImages", "MainImage", "IsAccessible" 
            };
            foreach (var c in hotelCols)
            {
                try { 
                    string type = (c == "Status") ? "VARCHAR(50) DEFAULT 'publicada'" : 
                                 (c == "IsAccessible") ? "TINYINT(1) DEFAULT 0" : "LONGTEXT NULL";
                    using var cmd = new MySqlConnector.MySqlCommand($"ALTER TABLE Hotels ADD COLUMN {c} {type}", conn);
                    await cmd.ExecuteNonQueryAsync(); 
                    Console.WriteLine($"> Hotels: Added {c}");
                } catch { }
            }
            try { 
                using var cmd = new MySqlConnector.MySqlCommand("ALTER TABLE Hotels MODIFY COLUMN Stars INT NULL", conn);
                await cmd.ExecuteNonQueryAsync(); 
            } catch { }

            // 2. Repair FLIGHTS
            string[] flightCols = { 
                "MainImage", "GalleryImages", "Policies", "Amenities", "TripType", 
                "FlightClasses", "Status", "Logo", "Terminal", "Frequency", "IsAccessible" 
            };
            foreach (var c in flightCols)
            {
                try { 
                    string type = (c == "Status") ? "VARCHAR(50) DEFAULT 'publicada'" : 
                                 (c == "IsAccessible") ? "TINYINT(1) DEFAULT 0" : "LONGTEXT NULL";
                    using var cmd = new MySqlConnector.MySqlCommand($"ALTER TABLE Flights ADD COLUMN {c} {type}", conn);
                    await cmd.ExecuteNonQueryAsync(); 
                    Console.WriteLine($"> Flights: Added {c}");
                } catch { }
            }
            string[] flightDecimals = { "EconomyPrice", "BusinessPrice", "FirstClassPrice" };
            foreach (var c in flightDecimals)
            {
                try { 
                    using var cmd = new MySqlConnector.MySqlCommand($"ALTER TABLE Flights ADD COLUMN {c} DECIMAL(18,2) NULL", conn);
                    await cmd.ExecuteNonQueryAsync(); 
                    Console.WriteLine($"> Flights: Added decimal {c}");
                } catch { }
            }

            // 3. Repair BOOKINGS
            string[] bookingCols = { "Gate", "Seat", "TicketNumber", "UserName", "PaymentType", "Status", "FlightClass" };
            foreach (var c in bookingCols)
            {
                try { 
                    using var cmd = new MySqlConnector.MySqlCommand($"ALTER TABLE Bookings ADD COLUMN {c} LONGTEXT NULL", conn);
                    await cmd.ExecuteNonQueryAsync(); 
                    Console.WriteLine($"> Bookings: Added {c}");
                } catch { }
            }
            try { 
                using var cmd = new MySqlConnector.MySqlCommand("ALTER TABLE Bookings ADD COLUMN IsRoundTrip TINYINT(1) DEFAULT 0", conn);
                await cmd.ExecuteNonQueryAsync(); 
                Console.WriteLine($"> Bookings: Added IsRoundTrip");
            } catch { }

            // 4. Repair HOTELBOOKINGS
            string[] hotelBookingCols = { "UserName", "RoomType", "PaymentType", "ReservationNumber", "Status" };
            foreach (var c in hotelBookingCols)
            {
                try { 
                    using var cmd = new MySqlConnector.MySqlCommand($"ALTER TABLE HotelBookings ADD COLUMN {c} LONGTEXT NULL", conn);
                    await cmd.ExecuteNonQueryAsync(); 
                    Console.WriteLine($"> HotelBookings: Added {c}");
                } catch { }
            }

            // 5. Repair USERCARDS
            try { 
                using var cmd = new MySqlConnector.MySqlCommand("ALTER TABLE UserCards ADD COLUMN CardType LONGTEXT NULL", conn);
                await cmd.ExecuteNonQueryAsync(); 
                Console.WriteLine($"> UserCards: Added CardType");
            } catch { }

            // 6. Repair ASPNETUSERS (ApplicationUser)
            string[] userCols = { "FirstName", "LastName", "Phone", "IsBCryptPassword", "ProfilePicture" };
            foreach (var c in userCols)
            {
                try { 
                    string type = (c == "IsBCryptPassword") ? "TINYINT(1) DEFAULT 0" : "LONGTEXT NULL";
                    using var cmd = new MySqlConnector.MySqlCommand($"ALTER TABLE AspNetUsers ADD COLUMN {c} {type}", conn);
                    await cmd.ExecuteNonQueryAsync(); 
                    Console.WriteLine($"> AspNetUsers: Added {c}");
                } catch { }
            }
            try { 
                using var cmd = new MySqlConnector.MySqlCommand("ALTER TABLE AspNetUsers ADD COLUMN CreatedAt DATETIME(6) DEFAULT CURRENT_TIMESTAMP(6)", conn);
                await cmd.ExecuteNonQueryAsync(); 
                Console.WriteLine($"> AspNetUsers: Added CreatedAt");
            } catch { }

            // 7. Repair ADMINTASKS
            string[] adminTaskCols = { "Title", "Description", "Status", "Priority", "AssignedTo" };
            foreach (var c in adminTaskCols)
            {
                try { 
                    using var cmd = new MySqlConnector.MySqlCommand($"ALTER TABLE AdminTasks ADD COLUMN {c} LONGTEXT NULL", conn);
                    await cmd.ExecuteNonQueryAsync(); 
                    Console.WriteLine($"> AdminTasks: Added {c}");
                } catch { }
            }
        }
    } catch (Exception ex) {
        Console.WriteLine($">>>> DB REPAIR ERROR: {ex.Message}");
    }
    Console.WriteLine(">>> FINISHED COMPREHENSIVE DB REPAIR <<<");

    await DbInitializer.Initialize(services);
}

app.Run();
