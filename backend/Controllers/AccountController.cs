using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using Casino.Data;

namespace Casino.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class AccountController : ControllerBase
{
    private readonly ApplicationDbContext _db;
    public AccountController(ApplicationDbContext db) => _db = db;

    [HttpGet("me")]
    public async Task<IActionResult> Me()
    {
        var uid = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var user = await _db.Users.AsNoTracking()
            .Where(u => u.Id == uid)
            .Select(u => new { u.Username, u.Email, u.Tokens })
            .FirstOrDefaultAsync();

        if (user is null) return NotFound();
        return Ok(user);
    }
}
