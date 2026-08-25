using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ProjetoHotelAviao.Models;

public class UserCard
{
    public int Id { get; set; }

    [Required]
    public string UserId { get; set; } = string.Empty; 

    [Required]
    public string CardHolderName { get; set; } = string.Empty;

    [Required]
    public string CardNumber { get; set; } = string.Empty; 

    [Required]
    public string ExpiryDate { get; set; } = string.Empty; 

    [Required]
    public string CVC { get; set; } = string.Empty;

    [Required]
    public string Country { get; set; } = string.Empty;
    
    public string CardType { get; set; } = "Visa"; 
}
