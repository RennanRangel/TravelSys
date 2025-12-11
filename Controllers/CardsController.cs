using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ProjetoHotelAviao.Data;
using ProjetoHotelAviao.Models;

namespace ProjetoHotelAviao.Controllers;

[Authorize]
public class CardsController : Controller
{
    private readonly ApplicationDbContext _context;

    public CardsController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpPost]
    public async Task<IActionResult> AddCard(string cardNumber, string expiryDate, string cvc, string nameOnCard, string country, bool saveCard, string returnUrl)
    {
        if (!saveCard)
        {
            TempData["Error"] = "Card not saved: 'Securely save' checkbox was not checked.";
            return Redirect(returnUrl);
        }

        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(userId)) 
        {
            TempData["Error"] = "Card not saved: User not logged in.";
            return Unauthorized();
        }

        var card = new UserCard
        {
            UserId = userId,
            CardNumber = cardNumber, 
            ExpiryDate = expiryDate,
            CVC = cvc,
            CardHolderName = nameOnCard,
            Country = country,
            CardType = GetCardType(cardNumber)
        };

        try
        {
            _context.UserCards.Add(card);
            await _context.SaveChangesAsync();
            TempData["Success"] = "Card saved successfully!";
        }
        catch (Exception ex)
        {
             TempData["Error"] = $"Error saving card: {ex.Message}";
        }

        return Redirect(returnUrl);
    }

    [HttpPost]
    public async Task<IActionResult> DeleteCard(int id, string returnUrl)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        var card = await _context.UserCards.FirstOrDefaultAsync(c => c.Id == id && c.UserId == userId);

        if (card != null)
        {
            _context.UserCards.Remove(card);
            await _context.SaveChangesAsync();
        }

        return Redirect(returnUrl);
    }

    private string GetCardType(string number)
    {
        if (number.StartsWith("4")) return "Visa";
        if (number.StartsWith("5")) return "Mastercard";
        return "Visa"; 
    }
}
