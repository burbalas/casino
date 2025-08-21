// Controllers/SlotsController.cs
using System.Linq;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Casino.Data;

namespace Casino.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class SlotsController : ControllerBase
{
    private readonly ApplicationDbContext _db;

    // Icon, Weight, TripleMultiplier, PairMultiplier
    private record Symbol(string Icon, int Weight, int Triple, int Pair);

    // RTP ~95%, win rate ~11.8%
    private static readonly Symbol[] SYMBOLS = new[]
    {
        new Symbol("🍒", 40,  7, 0),
        new Symbol("🍋", 30, 12, 0),
        new Symbol("🔔", 20, 17, 1),
        new Symbol("⭐",   8, 36, 2), // rare pair pays small
        new Symbol("💎",   2,146, 4), // very rare pair pays more
    };

    private static readonly int TOTAL_WEIGHT = SYMBOLS.Sum(s => s.Weight);

    public SlotsController(ApplicationDbContext db) => _db = db;

    public record SpinRequest(int Bet);

    [HttpPost("spin")]
    public async Task<IActionResult> Spin([FromBody] SpinRequest req)
    {
        var bet = Math.Clamp(req?.Bet ?? 0, 1, 1000);
        var uid = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

        await using var tx = await _db.Database.BeginTransactionAsync();

        var user = await _db.Users.FirstOrDefaultAsync(u => u.Id == uid);
        if (user is null) return Unauthorized();
        if (user.Tokens < bet) return BadRequest(new { message = "Insufficient tokens." });

        string SpinOne()
        {
            var r = Random.Shared.Next(TOTAL_WEIGHT); // 0..TOTAL_WEIGHT-1
            foreach (var s in SYMBOLS)
            {
                r -= s.Weight;
                if (r < 0) return s.Icon;
            }
            return SYMBOLS[0].Icon;
        }

        var reels = new[] { SpinOne(), SpinOne(), SpinOne() };

        // Evaluate: triples first, then eligible pairs (⭐, 💎)
        var counts = reels.GroupBy(x => x).ToDictionary(g => g.Key, g => g.Count());

        int multiplier = 0;
        string message = "Try again!";

        // triple?
        foreach (var s in SYMBOLS)
        {
            if (counts.TryGetValue(s.Icon, out var c) && c == 3)
            {
                multiplier = s.Triple;
                message = $"Triple {s.Icon}! x{multiplier}";
                break;
            }
        }

        // exactly one pair (only ⭐ or 💎 pay for pairs)
        if (multiplier == 0)
        {
            foreach (var s in SYMBOLS)
            {
                if (counts.TryGetValue(s.Icon, out var c) && c == 2 && s.Pair > 0)
                {
                    multiplier = s.Pair;
                    message = $"Pair of {s.Icon}! x{multiplier}";
                    break;
                }
            }
        }

        var win = bet * multiplier;
        var net = win - bet; // stake included in outcome
        user.Tokens = Math.Max(0, user.Tokens + net);

        await _db.SaveChangesAsync();
        await tx.CommitAsync();

        return Ok(new { reels, message, win, bet, balance = user.Tokens });
    }
}
