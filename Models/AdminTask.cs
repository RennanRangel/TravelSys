using System.ComponentModel.DataAnnotations;

namespace ProjetoHotelAviao.Models;

public class AdminTask
{
    public int Id { get; set; }
    
    [Required]
    public string Title { get; set; } = string.Empty;
    
    public string? Description { get; set; }
    
    public string Status { get; set; } = "afazer";
    
    public string Priority { get; set; } = "media";
    
    public string? AssignedTo { get; set; }
    
    public DateTime CreatedAt { get; set; } = DateTime.Now;
    
    public DateTime? CompletedAt { get; set; }
}
