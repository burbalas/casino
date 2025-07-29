// Program.cs  (or Startup.cs for older template)

// ───────────────────────────────────────────── using
using System.Text;
using Microsoft.IdentityModel.Tokens;
using Microsoft.EntityFrameworkCore;
using Casino.Data;

var builder = WebApplication.CreateBuilder(args);

// 1️⃣  Add controllers
builder.Services.AddControllers();

// 2️⃣  CORS policy : allow React dev server
builder.Services.AddCors(opt =>
{
    opt.AddPolicy("AllowFrontend", p =>
        p.WithOrigins("http://localhost:3000")
         .AllowAnyHeader()
         .AllowAnyMethod());
});

// 3️⃣  DbContext (MySQL via Pomelo)
var cs = builder.Configuration.GetConnectionString("DefaultConnection")!;
builder.Services.AddDbContext<ApplicationDbContext>(o =>
    o.UseMySql(cs, ServerVersion.AutoDetect(cs)));

// 4️⃣  JWT auth  (already configured earlier)
builder.Services.AddAuthentication("Bearer")
       .AddJwtBearer("Bearer", o =>
       {
           var key = Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]!);
           o.TokenValidationParameters = new TokenValidationParameters
           {
               ValidateIssuer           = true,
               ValidIssuer              = builder.Configuration["Jwt:Issuer"],
               ValidateAudience         = false,
               IssuerSigningKey         = new SymmetricSecurityKey(key)
           };
       });

var app = builder.Build();

// 5️⃣  **CORS MUST BE FIRST**  (before https redirection!)
app.UseCors("AllowFrontend");

// — Optional, only if you really need https during dev —
// app.UseHttpsRedirection();

app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

app.Run();
