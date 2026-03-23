using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using ProjetoHotelAviao.Models;

namespace ProjetoHotelAviao.Data;

public static class DbInitializer
{
    public static async Task Initialize(IServiceProvider serviceProvider)
    {
        var context = serviceProvider.GetRequiredService<ApplicationDbContext>();
        var userManager = serviceProvider.GetRequiredService<UserManager<ApplicationUser>>();
        var roleManager = serviceProvider.GetRequiredService<RoleManager<IdentityRole>>();
        var configuration = serviceProvider.GetRequiredService<IConfiguration>();

        // 1. Repairs / Schema Maintenance (MUST BE FIRST)
        await EnsureSchemaRepair(context);

        // 2. Roles setup
        string[] roles = { "Admin", "User" };
        foreach (var role in roles)
        {
            if (!await roleManager.RoleExistsAsync(role))
            {
                await roleManager.CreateAsync(new IdentityRole(role));
            }
        }

        
        var adminEmail = configuration["Authentication:AdminEmail"] ?? "admin@gmail.com";
        var adminPassword = configuration["Authentication:AdminPassword"] ?? "12345678";

        var existingAdmin = await userManager.FindByEmailAsync(adminEmail);
        if (existingAdmin == null)
        {
            var adminUser = new ApplicationUser
            {
                UserName = adminEmail,
                Email = adminEmail,
                FirstName = "Admin",
                LastName = "User",
                PhoneNumber = "1234567890",
                CreatedAt = DateTime.UtcNow,
                EmailConfirmed = true,
                IsBCryptPassword = false
            };

            var result = await userManager.CreateAsync(adminUser, adminPassword);
            if (result.Succeeded)
            {
                await userManager.AddToRoleAsync(adminUser, "Admin");
                Console.WriteLine($"Admin user created: {adminEmail}");
            }
            else
            {
                Console.WriteLine($"Failed to create admin user: {string.Join(", ", result.Errors.Select(e => e.Description))}");
            }
        }

        
        var admin2Email = configuration["Authentication:Admin2Email"] ?? "admin2@gmail.com";
        var admin2Password = configuration["Authentication:Admin2Password"] ?? "12345678";
        
        var existingAdmin2 = await userManager.FindByEmailAsync(admin2Email);
        if (existingAdmin2 == null)
        {
            var adminUser2 = new ApplicationUser
            {
                UserName = admin2Email,
                Email = admin2Email,
                FirstName = "Admin2",
                LastName = "User",
                PhoneNumber = "1234567891",
                CreatedAt = DateTime.UtcNow,
                EmailConfirmed = true,
                IsBCryptPassword = false
            };

            var result = await userManager.CreateAsync(adminUser2, admin2Password);
            if (result.Succeeded)
            {
                await userManager.AddToRoleAsync(adminUser2, "Admin");
                Console.WriteLine($"Admin2 user created: {admin2Email}");
            }
        }

    }

    private static async Task EnsureSchemaRepair(ApplicationDbContext context)
    {
        var conn = (MySqlConnector.MySqlConnection)context.Database.GetDbConnection();
        if (conn.State != System.Data.ConnectionState.Open) await conn.OpenAsync();

        try 
        {
            // 1. Repair HOTELS
            var hotelCols = new (string Name, string Type)[] { 
                ("Region", "LONGTEXT NULL"), ("BookingMode", "LONGTEXT NULL"), 
                ("CheckIn", "LONGTEXT NULL"), ("CheckOut", "LONGTEXT NULL"), 
                ("ReceptionMode", "LONGTEXT NULL"), ("ZipCode", "LONGTEXT NULL"), 
                ("Country", "LONGTEXT NULL"), ("Status", "VARCHAR(50) DEFAULT 'publicada'"), 
                ("Type", "LONGTEXT NULL"), ("Overview", "LONGTEXT NULL"), 
                ("MapUrl", "LONGTEXT NULL"), ("GalleryImages", "LONGTEXT NULL"), 
                ("MainImage", "LONGTEXT NULL"), ("IsAccessible", "TINYINT(1) DEFAULT 0") 
            };
            foreach (var col in hotelCols) await EnsureColumn(conn, "Hotels", col.Name, col.Type);
            await ExecuteManual(conn, "ALTER TABLE Hotels MODIFY COLUMN Stars INT NULL");

            // 2. Repair FLIGHTS
            var flightCols = new (string Name, string Type)[] { 
                ("MainImage", "LONGTEXT NULL"), ("GalleryImages", "LONGTEXT NULL"), 
                ("Policies", "LONGTEXT NULL"), ("Amenities", "LONGTEXT NULL"), 
                ("TripType", "LONGTEXT NULL"), ("FlightClasses", "LONGTEXT NULL"), 
                ("Status", "VARCHAR(50) DEFAULT 'publicada'"), ("Logo", "LONGTEXT NULL"), 
                ("Terminal", "LONGTEXT NULL"), ("Frequency", "LONGTEXT NULL"), 
                ("IsAccessible", "TINYINT(1) DEFAULT 0"),
                ("EconomyPrice", "DECIMAL(18,2) NULL"), ("BusinessPrice", "DECIMAL(18,2) NULL"), 
                ("FirstClassPrice", "DECIMAL(18,2) NULL")
            };
            foreach (var col in flightCols) await EnsureColumn(conn, "Flights", col.Name, col.Type);

            // 3. Repair BOOKINGS
            var bookingCols = new (string Name, string Type)[] { 
                ("Gate", "LONGTEXT NULL"), ("Seat", "LONGTEXT NULL"), 
                ("TicketNumber", "LONGTEXT NULL"), ("UserName", "LONGTEXT NULL"), 
                ("PaymentType", "LONGTEXT NULL"), ("Status", "LONGTEXT NULL"), 
                ("FlightClass", "LONGTEXT NULL"), ("IsRoundTrip", "TINYINT(1) NOT NULL DEFAULT 0") 
            };
            foreach (var col in bookingCols) await EnsureColumn(conn, "Bookings", col.Name, col.Type);

            // 4. Repair HOTELBOOKINGS
            var hbCols = new (string Name, string Type)[] { 
                ("UserName", "LONGTEXT NULL"), ("RoomType", "LONGTEXT NULL"), 
                ("PaymentType", "LONGTEXT NULL"), ("ReservationNumber", "LONGTEXT NULL"), 
                ("Status", "LONGTEXT NULL") 
            };
            foreach (var col in hbCols) await EnsureColumn(conn, "HotelBookings", col.Name, col.Type);

            // 5. Repair USERCARDS
            await EnsureColumn(conn, "UserCards", "CardType", "LONGTEXT NULL");

            // 6. Repair ASPNETUSERS
            var userCols = new (string Name, string Type)[] { 
                ("FirstName", "LONGTEXT NULL"), ("LastName", "LONGTEXT NULL"), 
                ("PhoneNumber", "LONGTEXT NULL"), ("IsBCryptPassword", "TINYINT(1) DEFAULT 0"), 
                ("ProfilePicture", "LONGTEXT NULL"),
                ("Address", "LONGTEXT NULL"),
                ("DateOfBirth", "DATETIME(6) NULL")
            };
            foreach (var col in userCols) await EnsureColumn(conn, "AspNetUsers", col.Name, col.Type);
            await EnsureColumn(conn, "AspNetUsers", "CreatedAt", "DATETIME(6) DEFAULT CURRENT_TIMESTAMP(6)");

            // 7. Repair ADMINTASKS
            // Tabela já criada via CREATE TABLE IF NOT EXISTS anteriormente ou pode ser reforçada aqui
            var taskCols = new (string Name, string Type)[] { 
                ("Title", "LONGTEXT NOT NULL"), ("Description", "LONGTEXT NULL"), 
                ("Status", "LONGTEXT NOT NULL"), ("Priority", "LONGTEXT NOT NULL"), 
                ("AssignedTo", "LONGTEXT NULL") 
            };
            foreach (var col in taskCols) await EnsureColumn(conn, "AdminTasks", col.Name, col.Type);

        }
        catch (Exception ex)
        {
            Console.WriteLine($">>> CRITICAL DB REPAIR ERROR: {ex.Message}");
        }
    }

    private static async Task EnsureColumn(MySqlConnector.MySqlConnection conn, string table, string column, string type)
    {
        try 
        {
            using var cmdCheck = new MySqlConnector.MySqlCommand(
                $"SELECT COUNT(*) FROM information_schema.columns WHERE table_name = '{table}' AND column_name = '{column}' AND table_schema = DATABASE();", conn);
            
            var count = Convert.ToInt32(await cmdCheck.ExecuteScalarAsync());
            if (count == 0)
            {
                using var cmdAdd = new MySqlConnector.MySqlCommand($"ALTER TABLE {table} ADD COLUMN {column} {type};", conn);
                await cmdAdd.ExecuteNonQueryAsync();
                Console.WriteLine($">>> DB REPAIR: Added {column} to {table} <<<");
            }
        }
        catch (Exception ex)
        {
            Console.WriteLine($">>> DB REPAIR WARNING: Could not ensure column {column} in {table}: {ex.Message}");
        }
    }

    private static async Task ExecuteManual(MySqlConnector.MySqlConnection conn, string sql)
    {
        try {
            using var cmd = new MySqlConnector.MySqlCommand(sql, conn);
            await cmd.ExecuteNonQueryAsync();
        } catch { }
    }
}
