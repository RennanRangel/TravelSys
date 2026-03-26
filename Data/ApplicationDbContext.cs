using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using ProjetoHotelAviao.Models;

namespace ProjetoHotelAviao.Data;

public class ApplicationDbContext : IdentityDbContext<ApplicationUser, IdentityRole, string>
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }

    public DbSet<Flight> Flights { get; set; }
    public DbSet<Hotel> Hotels { get; set; }
    public DbSet<Booking> Bookings { get; set; }
    public DbSet<HotelBooking> HotelBookings { get; set; }
    public DbSet<UserCard> UserCards { get; set; }
    public DbSet<AdminTask> AdminTasks { get; set; }
    public DbSet<Administrator> Administrators { get; set; }

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);
        
        builder.Entity<Administrator>().ToTable("Administrators");
    }
}
