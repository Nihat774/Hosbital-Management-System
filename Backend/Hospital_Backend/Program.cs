
using Hospital_Backend.Data;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Security.Claims;
using System.Text;
using Microsoft.OpenApi;
namespace Hospital_Backend
{
    public class Program
    {
        public static async Task Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);
            builder.Services.AddCors(options =>
            {
                options.AddPolicy("Frontend", policy =>
                {
                    policy
                        .WithOrigins("http://localhost:3000")
                        .AllowAnyHeader()
                        .AllowAnyMethod();
                });
            });
            // Controller ve Swagger
            builder.Services.AddControllers();
            builder.Services.AddEndpointsApiExplorer();

            builder.Services.AddSwaggerGen(options =>
            {
                options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
                {
                    Name = "Authorization",
                    Type = SecuritySchemeType.Http,
                    Scheme = "bearer",
                    BearerFormat = "JWT",
                    In = ParameterLocation.Header,
                    Description = "JWT token değerini girin."
                });

                options.AddSecurityRequirement(document => new OpenApiSecurityRequirement
                {
                    [new OpenApiSecuritySchemeReference("Bearer", document)] = new List<string>()
                });
            });




            // SQL Server bağlantısı
            builder.Services.AddDbContext<ApplicationDbContext>(options =>
                options.UseSqlServer(
                    builder.Configuration.GetConnectionString("DefaultConnection")
                )
            );

            // JWT doğrulama
            builder.Services
                .AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
                .AddJwtBearer(options =>
                {
                    options.TokenValidationParameters =
                        new TokenValidationParameters
                        {
                            ValidateIssuer = true,
                            ValidIssuer = builder.Configuration["Jwt:Issuer"],

                            ValidateAudience = true,
                            ValidAudience = builder.Configuration["Jwt:Audience"],

                            ValidateLifetime = true,
                            ValidateIssuerSigningKey = true,

                            IssuerSigningKey = new SymmetricSecurityKey(
                                Encoding.UTF8.GetBytes(
                                    builder.Configuration["Jwt:Key"]!
                                )
                            ),

                            RoleClaimType = ClaimTypes.Role,
                            NameClaimType = ClaimTypes.Name
                        };
                });

            // Yetkilendirme
            builder.Services.AddAuthorization();

            var app = builder.Build();

            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }

            app.UseCors("Frontend");

            app.UseHttpsRedirection();

            app.UseAuthentication();
            app.UseAuthorization();

            app.MapControllers();

            // Müdür hesabını oluştur
            if (app.Environment.IsDevelopment())
            {
                using var scope = app.Services.CreateScope();

                var context = scope.ServiceProvider
                    .GetRequiredService<ApplicationDbContext>();

                var passwordHasher =
                    new Microsoft.AspNetCore.Identity.PasswordHasher<
                        Hospital_Backend.Models.UserAccount>();

                const string managerEmail = "manager@hospital.local";

                var managerExists = await context.UserAccounts
                    .AnyAsync(user => user.Email == managerEmail);

                if (!managerExists)
                {
                    var manager = new Hospital_Backend.Models.UserAccount
                    {
                        FullName = "Sistem Müdürü",
                        Email = managerEmail,
                        Role = "Manager"
                    };

                    manager.PasswordHash = passwordHasher.HashPassword(
                        manager,
                        "Manager123!"
                    );

                    context.UserAccounts.Add(manager);
                    await context.SaveChangesAsync();
                }
            }

            app.Run();
        }
    }
}
