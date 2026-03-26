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

        await EnsureSchemaRepair(context);

        string[] roles = { "Admin", "User" };
        foreach (var role in roles)
        {
            if (!await roleManager.RoleExistsAsync(role))
            {
                await roleManager.CreateAsync(new IdentityRole(role));
            }
        }
        var adminRole = await roleManager.FindByNameAsync("Admin");
        if (adminRole != null)
        {
            var adminClaims = await roleManager.GetClaimsAsync(adminRole);
            var requiredClaims = new[] {
                new System.Security.Claims.Claim("Permission", "ManageTasks"),
                new System.Security.Claims.Claim("Permission", "DeleteTrip"),
                new System.Security.Claims.Claim("Permission", "AccessAdminPanel")
            };

            foreach (var claim in requiredClaims)
            {
                if (!adminClaims.Any(c => c.Type == claim.Type && c.Value == claim.Value))
                {
                    await roleManager.AddClaimAsync(adminRole, claim);
                    Console.WriteLine($">>> DB SEED: Claim '{claim.Value}' added to Admin role.");
                }
            }
        }

        
        var adminEmail = configuration["Authentication:AdminEmail"] ?? "admin@gmail.com";
        var adminPassword = configuration["Authentication:AdminPassword"] ?? "12345678";

        var existingAdmin = await userManager.FindByEmailAsync(adminEmail);
        if (existingAdmin == null)
        {
            var adminUser = new Administrator
            {
                UserName = adminEmail,
                Email = adminEmail,
                FirstName = "Admin",
                LastName = "User",
                PhoneNumber = "1234567890",
                CreatedAt = DateTime.UtcNow,
                EmailConfirmed = true,
                IsBCryptPassword = false,
                Role = UserRole.ADMIN
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
            var adminUser2 = new Administrator
            {
                UserName = admin2Email,
                Email = admin2Email,
                FirstName = "Admin2",
                LastName = "User",
                PhoneNumber = "1234567891",
                CreatedAt = DateTime.UtcNow,
                EmailConfirmed = true,
                IsBCryptPassword = false,
                Role = UserRole.ADMIN
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

            var bookingCols = new (string Name, string Type)[] { 
                ("Gate", "LONGTEXT NULL"), ("Seat", "LONGTEXT NULL"), 
                ("TicketNumber", "LONGTEXT NULL"), ("UserName", "LONGTEXT NULL"), 
                ("PaymentType", "LONGTEXT NULL"), ("Status", "LONGTEXT NULL"), 
                ("FlightClass", "LONGTEXT NULL"), ("IsRoundTrip", "TINYINT(1) NOT NULL DEFAULT 0") 
            };
            foreach (var col in bookingCols) await EnsureColumn(conn, "Bookings", col.Name, col.Type);

            var hbCols = new (string Name, string Type)[] { 
                ("UserName", "LONGTEXT NULL"), ("RoomType", "LONGTEXT NULL"), 
                ("PaymentType", "LONGTEXT NULL"), ("ReservationNumber", "LONGTEXT NULL"), 
                ("Status", "LONGTEXT NULL") 
            };
            foreach (var col in hbCols) await EnsureColumn(conn, "HotelBookings", col.Name, col.Type);

            await EnsureColumn(conn, "UserCards", "CardType", "LONGTEXT NULL");

            var userCols = new (string Name, string Type)[] { 
                ("FirstName", "LONGTEXT NULL"), ("LastName", "LONGTEXT NULL"), 
                ("PhoneNumber", "LONGTEXT NULL"), 
                ("IsBCryptPassword", "TINYINT(1) DEFAULT 0"), 
                ("ProfilePicture", "LONGTEXT NULL"),
                ("Address", "LONGTEXT NULL"),
                ("DateOfBirth", "DATETIME(6) NULL"),
                ("Role", "INT NOT NULL DEFAULT 3")
            };
            foreach (var col in userCols) await EnsureColumn(conn, "AspNetUsers", col.Name, col.Type);
            await EnsureColumn(conn, "AspNetUsers", "CreatedAt", "DATETIME(6) DEFAULT CURRENT_TIMESTAMP(6)");

            var taskCols = new (string Name, string Type)[] { 
                ("Title", "LONGTEXT NOT NULL"), ("Description", "LONGTEXT NULL"), 
                ("Status", "LONGTEXT NOT NULL"), ("Priority", "LONGTEXT NOT NULL"), 
                ("AssignedTo", "LONGTEXT NULL") 
            };
            foreach (var col in taskCols) await EnsureColumn(conn, "AdminTasks", col.Name, col.Type);
            
            await ExecuteManual(conn, @"
                UPDATE AspNetUsers 
                SET Role = 2 
                WHERE Id IN (
                    SELECT ur.UserId 
                    FROM AspNetUserRoles ur 
                    JOIN AspNetRoles r ON ur.RoleId = r.Id 
                    WHERE r.Name = 'Admin'
                ) AND (Role = 3 OR Role = 0)");

            await ExecuteManual(conn, @"
                CREATE TABLE IF NOT EXISTS Administrators (
                    Id VARCHAR(255) NOT NULL,
                    PRIMARY KEY (Id),
                    CONSTRAINT FK_Administrators_AspNetUsers_Id FOREIGN KEY (Id) REFERENCES AspNetUsers (Id) ON DELETE CASCADE
                )");

            await ExecuteManual(conn, @"
                INSERT IGNORE INTO Administrators (Id)
                SELECT Id FROM AspNetUsers WHERE Role = 1 OR Role = 2");

            await ExecuteManual(conn, @"
                UPDATE AspNetUsers 
                SET Role = 1 
                WHERE Email = 'admin@gmail.com'");
                
            await ExecuteManual(conn, @"
                INSERT IGNORE INTO Administrators (Id)
                SELECT Id FROM AspNetUsers WHERE Email = 'admin@gmail.com'");

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
