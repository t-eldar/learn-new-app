using System.Text;
using System.Text.Json;
using System.Text.Json.Serialization;

using LearnNew.Authentication;
using LearnNew.Authorization;
using LearnNew.Authorization.Handlers;
using LearnNew.Authorization.Requirements;
using LearnNew.DatabaseContext;
using LearnNew.Extensions.MapExtensions;
using LearnNew.Models.Authentication;
using LearnNew.Models.Cookies;
using LearnNew.Services.Implementations;
using LearnNew.Services.Interfaces;
using LearnNew.WebApi.Extensions;
using LearnNew.WebApi.Extensions.MapExtensions;

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http.Json;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

var connection = builder.Configuration.GetConnectionString("LearnNew");

builder.Services.Configure<JsonOptions>(options =>
{
    options.SerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
});

builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(builder =>
    {
        builder
            .WithOrigins("https://localhost:3000")
            .AllowCredentials()
            .AllowAnyMethod()
            .AllowAnyHeader();
    });
});

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddDbContext<IApplicationContext, ApplicationContext>(options =>
{
    options.UseNpgsql(connection);
});

builder.Services.AddScoped<
    IUserClaimsPrincipalFactory<User>,
    ApplicationUserClaimsPrincipalFactory
>();

builder.Services
    .AddIdentity<User, IdentityRole>(options =>
    {
        options.User.RequireUniqueEmail = true;
    })
    .AddEntityFrameworkStores<ApplicationContext>()
    .AddClaimsPrincipalFactory<ApplicationUserClaimsPrincipalFactory>();

builder.Services.AddAuthorization(options =>
{
    options.AddPolicy(
        AuthorizationPolicies.SameAuthor,
        policy => policy.Requirements.Add(new SameAuthorRequirement())
    );
});

builder.Services.AddSingleton<IAuthorizationHandler, ResourceAuthorizationHandler>();

builder.Services.AddTransient<IDateTimeProvider, DateTimeProvider>();
builder.Services.AddRepositories();
builder.Services.AddTransient<ITestService, TestService>();

builder.Services.ConfigureApplicationCookie(options =>
{
    options.Cookie.SameSite = SameSiteMode.None;
    options.LoginPath = string.Empty;
    options.AccessDeniedPath = string.Empty;

    options.Events.OnRedirectToAccessDenied = context =>
    {
        context.Response.StatusCode = StatusCodes.Status403Forbidden;
        return Task.CompletedTask;
    };
    options.Events.OnRedirectToLogin = context =>
    {
        context.Response.StatusCode = StatusCodes.Status401Unauthorized;
        return Task.CompletedTask;
    };
});

var app = builder.Build();

app.UseCors();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}
app.UseHttpsRedirection();

app.UseAuthentication();
app.UseAuthorization();

//app.Use((context, next) =>
//{
//    if (context.User.Identity?.IsAuthenticated ?? false)
//    {
//        if (context.Request.Headers.Cookie.Any(c => c?.Contains("user-info") ?? false)) 
//        {
//            return next();
//        }
//        var user = new UserInfoCookie
//        {
//            Email = context.User.Claims.FirstOrDefault(c => c.Type == "email")?.Value 
//                ?? string.Empty,
//            Name = context.User.Claims.FirstOrDefault(c => c.Type == "name")?.Value 
//                ?? string.Empty,
//            Surname = context.User.Claims.FirstOrDefault(c => c.Type == "surname")?.Value
//                ?? string.Empty,
//            Id = context.User.Claims.FirstOrDefault(c => c.Type == "id")?.Value 
//                ?? string.Empty,
//        };
//        var userJson = JsonSerializer.Serialize(user, new JsonSerializerOptions()
//        {
//            PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
//        });
//        var userBase64 = Convert.ToBase64String(Encoding.UTF8.GetBytes(userJson));
//        context.Response.Cookies.Append("user-info", "true");
//        context.Response.Cookies.Append("user-info-payload", userBase64);
//    }
//    return next();
//});


app.MapAuthentication();
app.MapAnswers();
app.MapCourses();
app.MapLessons();
app.MapQuestions();
app.MapQuestionScores();
app.MapTests();
app.MapTestScores();
app.MapCheckTests();

app.Run();
