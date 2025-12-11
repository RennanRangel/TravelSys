using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ProjetoHotelAviao.Models;

public class Hotel
{
    public int Id { get; set; }
    
    [Required]
    public string Name { get; set; } = string.Empty;
    
    [Required]
    public string Location { get; set; } = string.Empty;
    
    public string? Type { get; set; } 
    
    public string? Overview { get; set; }
    
    public string? MapUrl { get; set; }
    
    public string? MainImage { get; set; }
    
    public string? GalleryImages { get; set; } 
    
    [Required]
    [Range(3, 5)]
    public int Stars { get; set; }
    
    [Required]
    [Column(TypeName = "decimal(18,2)")]
    public decimal Price { get; set; }
    
    [Column(TypeName = "decimal(3,2)")]
    public decimal Rating { get; set; }
    
    public int Reviews { get; set; }
    
    public string? Amenities { get; set; } 

    [NotMapped]
    public IFormFile? MainImageUpload { get; set; }

    [NotMapped]
    public List<IFormFile>? GalleryImagesUpload { get; set; }

    [NotMapped]
    public List<string>? ImagesToDelete { get; set; }
}
