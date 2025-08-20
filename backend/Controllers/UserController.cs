using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.AspNetCore.Identity;
using Casino.Data;
using Casino.Models;

namespace Casino.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UsersController : ControllerBase
{
    private readonly ApplicationDbContext _db;
    private readonly IConfiguration _cfg;
    private readonly IPasswordHasher<User> _hasher;

    public UsersController(ApplicationDbContext db, IConfiguration cfg, IPasswordHasher<User> hasher)
    {
        _db = db;
        _cfg = cfg;
        _hasher = hasher;
    }

    // ───────────────────────── REGISTER
    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterModel m)
    {
        if (!ModelState.IsValid) return ValidationProblem(ModelState);

        var username = m.Username.Trim();
        var email = m.Email.Trim().ToLowerInvariant();

        if (await _db.Users.AnyAsync(u => u.Username == username || u.Email == email))
            return Conflict(new { message = "Username or e-mail already in use." });

        var user = new User
        {
            Username = username,
            Email = email,
            PasswordHash = "" // set below
        };
        user.PasswordHash = _hasher.HashPassword(user, m.Password);

        _db.Users.Add(user);
        try
        {
            await _db.SaveChangesAsync();
            return Ok(new { userId = user.Id });
        }
        catch (DbUpdateException)
        {
            return Conflict(new { message = "Username or e-mail already in use." });
        }
    }

    // ───────────────────────── LOGIN
    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginModel m)
    {
        if (!ModelState.IsValid) return ValidationProblem(ModelState);

        var name = m.Username.Trim();
        var user = await _db.Users.FirstOrDefaultAsync(u => u.Username == name);
        if (user is null) return Unauthorized(new { message = "Invalid credentials." });

        var verified = _hasher.VerifyHashedPassword(user, user.PasswordHash, m.Password);
        if (verified != PasswordVerificationResult.Success)
            return Unauthorized(new { message = "Invalid credentials." });

        return Ok(new { token = GenerateJwtToken(user) });
    }

    // ───────────────────────── helpers
    private string GenerateJwtToken(User user)
    {
        var key = _cfg["Jwt:Key"] ?? throw new("Jwt:Key missing");
        if (key.Length < 32) throw new InvalidOperationException("Jwt:Key must be ≥32 chars");

        var creds = new SigningCredentials(
            new SymmetricSecurityKey(Encoding.UTF8.GetBytes(key)),
            SecurityAlgorithms.HmacSha256);

        var claims = new[]
        {
            new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new Claim(ClaimTypes.Name, user.Username)
        };

        var token = new JwtSecurityToken(
            issuer: _cfg["Jwt:Issuer"],
            audience: null,
            claims: claims,
            expires: DateTime.UtcNow.AddMinutes(15),
            signingCredentials: creds);

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}
