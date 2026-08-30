using System.ComponentModel.DataAnnotations;
using Microsoft.EntityFrameworkCore;

namespace Casino.Models;

// DB-level uniqueness — one index per column
[Index(nameof(Username), IsUnique = true)]
[Index(nameof(Email), IsUnique = true)]
public class User
{
    public int Id { get; set; }

    public required string Username { get; set; }
    public required string Email { get; set; }
    public required string PasswordHash { get; set; }
    public int Tokens { get; set; } = 1000;

}
