using Microsoft.EntityFrameworkCore;
using Casino.Models;

namespace Casino.Data;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options) { }

    public DbSet<User> Users => Set<User>();

    protected override void OnModelCreating(ModelBuilder mb)
    {
        base.OnModelCreating(mb);

        // OPTIONAL - make Username truly case-sensitive (MySQL)
        // mb.Entity<User>()
        //   .Property(u => u.Username)
        //   .UseCollation("utf8mb4_bin");
    }
}
