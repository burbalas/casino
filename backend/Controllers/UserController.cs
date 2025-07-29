using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Casino.Data;
using Casino.Models;
using System.ComponentModel.DataAnnotations;



namespace Casino.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UsersController : ControllerBase
{
    private readonly ApplicationDbContext _db;
    private readonly IConfiguration       _cfg;

    public UsersController(ApplicationDbContext db, IConfiguration cfg)
    {
        _db  = db;
        _cfg = cfg;
    }

    // ───────────────────────────── REGISTER
    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterModel m)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);

        // friendly pre-check
        if (await _db.Users.AnyAsync(u => u.Username == m.Username || u.Email == m.Email))
            return Conflict("Username or e-mail already in use.");

        var user = new User
        {
            Username     = m.Username,
            Email        = m.Email,
            PasswordHash = Hash(m.Password)
        };
        _db.Users.Add(user);

        try
        {
            await _db.SaveChangesAsync();              // may still throw on race-condition
            return Ok(new { userId = user.Id });
        }
        catch (DbUpdateException)                     // UNIQUE index tripped
        {
            return Conflict("Username or e-mail already in use.");
        }
    }

    // ───────────────────────────── LOGIN
    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginModel m)
    {
        var user = await _db.Users.FirstOrDefaultAsync(u => u.Username == m.Username);
        if (user is null || !Verify(m.Password, user.PasswordHash))
            return Unauthorized("Invalid credentials.");

        return Ok(new { token = GenerateJwtToken(user.Username) });
    }

    // ───────────────────────────── helpers
    private static string Hash(string plain) =>
        Convert.ToBase64String(Encoding.UTF8.GetBytes(plain));

    private static bool Verify(string plain, string hash) =>
        Hash(plain) == hash;

    private string GenerateJwtToken(string username)
    {
        var key    = _cfg["Jwt:Key"]   ?? throw new("Jwt:Key missing");
        if (key.Length < 32) throw new InvalidOperationException("Jwt:Key must be ≥32 chars");

        var creds  = new SigningCredentials(
            new SymmetricSecurityKey(Encoding.UTF8.GetBytes(key)),
            SecurityAlgorithms.HmacSha256);

        var token  = new JwtSecurityToken(
            issuer: _cfg["Jwt:Issuer"],
            audience: null,
            claims: new[] { new Claim(ClaimTypes.Name, username) },
            expires: DateTime.UtcNow.AddMinutes(15),
            signingCredentials: creds);

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}

