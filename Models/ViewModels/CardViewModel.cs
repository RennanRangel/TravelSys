using System.ComponentModel.DataAnnotations;

namespace ProjetoHotelAviao.Models.ViewModels;

public class CardViewModel
{
    [Required(ErrorMessage = "O número do cartão é obrigatório.")]
    [CreditCard(ErrorMessage = "Número de cartão inválido.")]
    public string CardNumber { get; set; } = string.Empty;

    [Required(ErrorMessage = "A data de expiração é obrigatória.")]
    [RegularExpression(@"^(0[1-9]|1[0-2])\/([0-9]{2})$", ErrorMessage = "Formato MM/YY inválido.")]
    public string ExpiryDate { get; set; } = string.Empty;

    [Required(ErrorMessage = "O CVC é obrigatório.")]
    [RegularExpression(@"^[0-9]{3,4}$", ErrorMessage = "CVC inválido.")]
    public string CVC { get; set; } = string.Empty;

    [Required(ErrorMessage = "O nome no cartão é obrigatório.")]
    public string NameOnCard { get; set; } = string.Empty;

    [Required(ErrorMessage = "O país é obrigatório.")]
    public string Country { get; set; } = string.Empty;

    public bool SaveCard { get; set; }
}
