using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ProjetoHotelAviao.Models;

public class Administrator : ApplicationUser
{
    public Administrator()
    {
        Role = UserRole.ADMIN;
    }
}
