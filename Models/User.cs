using System.ComponentModel.DataAnnotations;

namespace ProjetoHotelAviao.Models;

public class User
{
    public int Id { get; set; }
    
    [Required]
    [EmailAddress]
    public string Email { get; set; } = string.Empty;
    
    [Required]
    public string PasswordHash { get; set; } = string.Empty;
    
    public string? FirstName { get; set; }
    
    public string? LastName { get; set; }
    
    public string? Phone { get; set; }
    
    public DateTime CreatedAt { get; set; }
    
    public bool IsAdmin { get; set; } = false;
}
