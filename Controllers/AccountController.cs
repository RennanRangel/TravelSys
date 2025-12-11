using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using ProjetoHotelAviao.Data;
using ProjetoHotelAviao.Models;

namespace ProjetoHotelAviao.Controllers;

public class AccountController : Controller
{
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly SignInManager<ApplicationUser> _signInManager;
    private readonly RoleManager<IdentityRole> _roleManager;
    private readonly ApplicationDbContext _context;

    public AccountController(
        UserManager<ApplicationUser> userManager,
        SignInManager<ApplicationUser> signInManager,
        RoleManager<IdentityRole> roleManager,
        ApplicationDbContext context)
    {
        _userManager = userManager;
        _signInManager = signInManager;
        _roleManager = roleManager;
        _context = context;
    }

    [Authorize]
    public async Task<IActionResult> Index()
    {
        var user = await _userManager.GetUserAsync(User);
        if (user == null) return NotFound();
        return View(user);
    }

    [HttpGet]
    public IActionResult Login(string? returnUrl = null)
    {
        if (User.Identity?.IsAuthenticated == true)
        {
            return RedirectToAction("Index", "Home");
        }
        ViewData["ReturnUrl"] = returnUrl;
        return View();
    }

    [HttpPost]
    public async Task<IActionResult> Login(string email, string password, bool rememberMe, string? returnUrl = null)
    {
        var user = await _userManager.FindByEmailAsync(email);
        
        if (user != null)
        {
            bool passwordValid = false;
            
            
            if (user.IsBCryptPassword)
            {
                if (BCrypt.Net.BCrypt.Verify(password, user.PasswordHash))
                {
                    passwordValid = true;
                    
                    
                    var token = await _userManager.GeneratePasswordResetTokenAsync(user);
                    await _userManager.ResetPasswordAsync(user, token, password);
                    user.IsBCryptPassword = false;
                    await _userManager.UpdateAsync(user);
                }
            }
            else
            {
                
                passwordValid = await _userManager.CheckPasswordAsync(user, password);
            }
            
            if (passwordValid)
            {
                await _signInManager.SignInAsync(user, rememberMe);
                
                
                if (await _userManager.IsInRoleAsync(user, "Admin"))
                {
                    return RedirectToAction("Index", "Admin");
                }
                
                if (!string.IsNullOrEmpty(returnUrl) && Url.IsLocalUrl(returnUrl))
                {
                    return Redirect(returnUrl);
                }
                
                return RedirectToAction("Index", "Home");
            }
        }

        ModelState.AddModelError(string.Empty, "Invalid login attempt.");
        return View();
    }

    [HttpGet]
    public IActionResult Signup()
    {
        if (User.Identity?.IsAuthenticated == true)
        {
            return RedirectToAction("Index", "Home");
        }
        return View();
    }

    [HttpPost]
    public async Task<IActionResult> Signup(string email, string password, string confirmPassword, 
        string? firstName, string? lastName, string? phone)
    {
        if (password != confirmPassword)
        {
            ModelState.AddModelError(string.Empty, "Passwords do not match.");
            return View();
        }

        var existingUser = await _userManager.FindByEmailAsync(email);
        if (existingUser != null)
        {
            ModelState.AddModelError(string.Empty, "Email already registered.");
            return View();
        }

        var user = new ApplicationUser
        {
            UserName = email,
            Email = email,
            FirstName = firstName,
            LastName = lastName,
            Phone = phone,
            CreatedAt = DateTime.UtcNow,
            IsBCryptPassword = false
        };

        var result = await _userManager.CreateAsync(user, password);
        
        if (result.Succeeded)
        {
            
            if (!await _roleManager.RoleExistsAsync("User"))
            {
                await _roleManager.CreateAsync(new IdentityRole("User"));
            }
            await _userManager.AddToRoleAsync(user, "User");
            
            
            await _signInManager.SignInAsync(user, isPersistent: false);
            
            return RedirectToAction("Index", "Home");
        }

        foreach (var error in result.Errors)
        {
            ModelState.AddModelError(string.Empty, error.Description);
        }
        
        return View();
    }

    [HttpPost]
    public async Task<IActionResult> Logout()
    {
        await _signInManager.SignOutAsync();
        return RedirectToAction("Index", "Home");
    }

    [HttpPost]
    public async Task<IActionResult> SwitchAccount()
    {
        await _signInManager.SignOutAsync();
        return RedirectToAction("Login", "Account");
    }

    [Authorize]
    public async Task<IActionResult> Profile()
    {
        var user = await _userManager.GetUserAsync(User);
        return View(user);
    }

    [HttpGet]
    public IActionResult ForgotPassword()
    {
        if (User.Identity?.IsAuthenticated == true)
        {
            return RedirectToAction("Index", "Home");
        }
        return View();
    }

    [HttpPost]
    public async Task<IActionResult> ForgotPassword(string email)
    {
        var user = await _userManager.FindByEmailAsync(email);
        if (user == null)
        {
            ModelState.AddModelError(string.Empty, "Email not found.");
            return View();
        }

        
        return RedirectToAction("SetPassword", new { email = email });
    }

    [HttpGet]
    public IActionResult SetPassword(string email)
    {
        if (string.IsNullOrEmpty(email))
        {
            return RedirectToAction("Login");
        }
        ViewData["Email"] = email;
        return View();
    }

    [HttpPost]
    public async Task<IActionResult> SetPassword(string email, string password, string confirmPassword)
    {
        if (password != confirmPassword)
        {
            ModelState.AddModelError(string.Empty, "Passwords do not match.");
            ViewData["Email"] = email;
            return View();
        }

        var user = await _userManager.FindByEmailAsync(email);
        if (user == null)
        {
            return RedirectToAction("Login");
        }

        
        var token = await _userManager.GeneratePasswordResetTokenAsync(user);
        var result = await _userManager.ResetPasswordAsync(user, token, password);
        
        if (result.Succeeded)
        {
            user.IsBCryptPassword = false;
            await _userManager.UpdateAsync(user);
            return RedirectToAction("Login");
        }

        foreach (var error in result.Errors)
        {
            ModelState.AddModelError(string.Empty, error.Description);
        }
        
        ViewData["Email"] = email;
        return View();
    }

    [Authorize]
    [HttpPost]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> DeleteAccount()
    {
        var user = await _userManager.GetUserAsync(User);
        if (user != null)
        {
            await _signInManager.SignOutAsync();
            await _userManager.DeleteAsync(user);
        }

        return RedirectToAction("Index", "Home");
    }
}
