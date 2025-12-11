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
                Phone = "1234567890",
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
                Phone = "1234567891",
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
}
