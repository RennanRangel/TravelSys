using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ProjetoHotelAviao.Models;

public class Flight
{
    public int Id { get; set; }
    
    [Required]
    public string Airline { get; set; } = string.Empty; 
    
    [Required]
    public string Logo { get; set; } = string.Empty; 
    
    [Required]
    public string From { get; set; } = string.Empty;     
    [Required]
    public string To { get; set; } = string.Empty; 
    [Required]
    public string Departure { get; set; } = string.Empty; 
    [Required]
    public string Arrival { get; set; } = string.Empty; 
    
    [Required]
    public string Duration { get; set; } = string.Empty; 
    
    [Required]
    public string Stops { get; set; } = string.Empty; 
    
    [Required]
    [Column(TypeName = "decimal(18,2)")]
    public decimal Price { get; set; }
    
    [Column(TypeName = "decimal(3,2)")]
    public decimal Rating { get; set; }
    
    public int Reviews { get; set; }
    
    public string? MainImage { get; set; }

    public string? GalleryImages { get; set; }
    
    public string? Policies { get; set; }
    
    public string? Amenities { get; set; }

    public string? TripType { get; set; }

    [NotMapped]
    public IFormFile? LogoUpload { get; set; }

    [NotMapped]
    public IFormFile? MainImageUpload { get; set; }

    [NotMapped]
    public List<IFormFile>? GalleryImagesUpload { get; set; }

    [NotMapped]
    public List<string>? ImagesToDelete { get; set; }
}
