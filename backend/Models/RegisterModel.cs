// DTOs/RegisterModel.cs
using System.ComponentModel.DataAnnotations;

namespace Casino.Models;

public class RegisterModel
{
    [Required, StringLength(32, MinimumLength = 3)]
    public string Username { get; init; } = null!;

    [Required, EmailAddress]
    public string Email    { get; init; } = null!;

    [Required, StringLength(100, MinimumLength = 6)]
    public string Password { get; init; } = null!;
}
