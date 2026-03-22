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

    // FORCED DB FIX
    Console.WriteLine(">>> STARTING FORCED DB FIX <<<");
    try {
        using (var conn = new MySqlConnector.MySqlConnection(mySqlConnection))
        {
            await conn.OpenAsync();
            string[] cols = { "Region", "BookingMode", "CheckIn", "CheckOut", "ReceptionMode", "ZipCode", "Country" };
            foreach (var c in cols)
            {
                try { 
                    using var cmd = new MySqlConnector.MySqlCommand($"ALTER TABLE Hotels ADD COLUMN {c} LONGTEXT NULL", conn);
                    await cmd.ExecuteNonQueryAsync(); 
                    Console.WriteLine($"> Successfully added column: {c}");
                } catch { /* likely exists */ }
            }
            try { 
                using var cmd = new MySqlConnector.MySqlCommand("ALTER TABLE Hotels MODIFY COLUMN Stars INT NULL", conn);
                await cmd.ExecuteNonQueryAsync(); 
                Console.WriteLine("> Successfully modified Stars column.");
            } catch { }

            // FORECED FLIGHTS DB FIX
            string[] flightColsText = { "FlightClasses" };
            foreach (var c in flightColsText)
            {
                try { 
                    using var cmd = new MySqlConnector.MySqlCommand($"ALTER TABLE Flights ADD COLUMN {c} LONGTEXT NULL", conn);
                    await cmd.ExecuteNonQueryAsync(); 
                    Console.WriteLine($"> Successfully added column: {c}");
                } catch { /* likely exists */ }
            }
            string[] flightColsDecimal = { "EconomyPrice", "BusinessPrice", "FirstClassPrice" };
            foreach (var c in flightColsDecimal)
            {
                try { 
                    using var cmd = new MySqlConnector.MySqlCommand($"ALTER TABLE Flights ADD COLUMN {c} DECIMAL(18,2) NULL", conn);
                    await cmd.ExecuteNonQueryAsync(); 
                    Console.WriteLine($"> Successfully added column: {c}");
                } catch { /* likely exists */ }
            }
            }
        } catch (Exception ex) {
            Console.WriteLine($">>> DB FIX FAILED: {ex.Message}");
        }
        Console.WriteLine(">>> FINISHED FORCED DB FIX <<<");

    await DbInitializer.Initialize(services);
}

app.Run();
