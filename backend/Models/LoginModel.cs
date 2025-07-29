using System.ComponentModel.DataAnnotations;

namespace Casino.Models;

public record LoginModel(
    [Required] string Username,
    [Required] string Password
);
