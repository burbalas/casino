// Program.cs
using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Casino.Data;
using Casino.Models;

var builder = WebApplication.CreateBuilder(args);

// Controllers + Swagger (dev)
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// CORS from config
var allowed = builder.Configuration.GetSection("Cors:AllowedOrigins").Get<string[]>() 
              ?? new[] { "http://localhost:5173", "http://localhost:3000" };
builder.Services.AddCors(opt =>
{
    opt.AddPolicy("AllowFrontend", p =>
        p.WithOrigins(allowed)
         .AllowAnyHeader()
         .AllowAnyMethod());
});

// DbContext (MySQL via Pomelo)
var cs = builder.Configuration.GetConnectionString("DefaultConnection")!;
builder.Services.AddDbContext<ApplicationDbContext>(o =>
    o.UseMySql(cs, ServerVersion.AutoDetect(cs)));

// Password hasher
builder.Services.AddScoped<IPasswordHasher<User>, PasswordHasher<User>>();

// JWT auth
var jwtKey    = builder.Configuration["Jwt:Key"]    ?? throw new("Jwt:Key missing");
var jwtIssuer = builder.Configuration["Jwt:Issuer"] ?? "CasinoApi";

builder.Services
    .AddAuthentication(options =>
    {
        options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
        options.DefaultChallengeScheme    = JwtBearerDefaults.AuthenticationScheme;
    })
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer           = true,
            ValidIssuer              = jwtIssuer,
            ValidateAudience         = false,
            ValidateIssuerSigningKey = true,
            IssuerSigningKey         = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey)),
            ValidateLifetime         = true,
            ClockSkew                = TimeSpan.Zero
        };
    });

var app = builder.Build();

// Swagger only in Dev
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// CORS must be early
app.UseCors("AllowFrontend");

app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

app.Run();
