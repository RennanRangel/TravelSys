using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations;

namespace ProjetoHotelAviao.Models;

public class ApplicationUser : IdentityUser
{
    public string? FirstName { get; set; }
    
    public string? LastName { get; set; }
    
    public string? Phone { get; set; }
    
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    
  
    public bool IsBCryptPassword { get; set; } = false;
    public string? ProfilePicture { get; set; }
    
    public string? Address { get; set; }
    
    public DateTime? DateOfBirth { get; set; }

    [Required]
    public UserRole Role { get; set; } = UserRole.USER;
}

public enum UserRole
{
    SUPER_ADMIN = 1,
    ADMIN = 2,
    USER = 3
}
