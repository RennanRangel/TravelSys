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
    
    public int? Stars { get; set; }
    
    [Required]
    [Column(TypeName = "decimal(18,2)")]
    public decimal Price { get; set; }
    
    [Column(TypeName = "decimal(3,2)")]
    public decimal Rating { get; set; }
    
    public int Reviews { get; set; }
    
    public string? Amenities { get; set; } 

    public string? Region { get; set; }
    public string? BookingMode { get; set; }
    public string? CheckIn { get; set; }
    public string? CheckOut { get; set; }
    public string? ReceptionMode { get; set; }
    public string? ZipCode { get; set; }
    public string? Country { get; set; }
    public bool IsAccessible { get; set; }
    public string Status { get; set; } = "publicada";

    [NotMapped]
    public IFormFile? MainImageUpload { get; set; }

    [NotMapped]
    public List<IFormFile>? GalleryImagesUpload { get; set; }

    [NotMapped]
    public List<string>? ImagesToDelete { get; set; }
}
