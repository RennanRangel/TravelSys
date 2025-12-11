using Microsoft.AspNetCore.Identity;

namespace ProjetoHotelAviao.Models;

/// <summary>
/// Custom user class extending IdentityUser with additional profile fields
/// </summary>
public class ApplicationUser : IdentityUser
{
    public string? FirstName { get; set; }
    
    public string? LastName { get; set; }
    
    public string? Phone { get; set; }
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    
  
    public bool IsBCryptPassword { get; set; } = false;
}
