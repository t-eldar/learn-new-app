using System.Text.Json;
using System.Text;

using LearnNew.Models.Authentication;
using LearnNew.Models.Cookies;

using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using LearnNew.Models.Requests.Authentication;

namespace LearnNew.WebApi.Extensions.MapExtensions;

public static class MapAuthenticationExtensions
{
    public static IEndpointRouteBuilder MapAuthentication(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/")
            .WithOpenApi()
            .WithTags("Authentication");

        group.MapPost("/sign-up", async (
            [FromBody] SignUpRequest request,
            UserManager<User> userManager,
            SignInManager<User> signInManager) =>
        {
            var user = new User()
            {
                UserName = request.Email,
                Name = request.Name,
                Surname = request.Surname,
                Email = request.Email,
            };
            var registerResult = await userManager.CreateAsync(user, request.Password);
            if (!registerResult.Succeeded)
            {
                return Results.BadRequest("Bad credentials");
            }

            var signInResult = await signInManager.PasswordSignInAsync(user, request.Password, true, false);

            return signInResult.Succeeded
                ? Results.Ok()
                : Results.Unauthorized();
        });

        group.MapPost("/sign-in", async (
            [FromBody] SignInRequest request,
            HttpContext context,
            UserManager<User> userManager,
            SignInManager<User> signInManager) =>
        {
            var user = await userManager.FindByEmailAsync(request.Email);
            if (user is null)
            {
                return Results.Unauthorized();
            }

            var signInResult = await signInManager.PasswordSignInAsync(user, request.Password, request.RememberMe, false);

            return signInResult.Succeeded
                ? Results.Ok()
                : Results.Unauthorized();
        });

        group.MapGet("/user-info", (HttpContext context) =>
        {
            if (!context.User.Identity?.IsAuthenticated ?? true)
            {
                return Results.Unauthorized();
            }
            var userInfo = new UserInfoCookie
            {
                Email = context.User.Claims.FirstOrDefault(c => c.Type == "email")?.Value
                    ?? string.Empty,
                Name = context.User.Claims.FirstOrDefault(c => c.Type == "name")?.Value
                    ?? string.Empty,
                Surname = context.User.Claims.FirstOrDefault(c => c.Type == "surname")?.Value
                    ?? string.Empty,
                Id = context.User.Claims.FirstOrDefault(c => c.Type == "id")?.Value
                    ?? string.Empty,
            };

            return TypedResults.Ok(userInfo);
        }).RequireAuthorization();

        group.MapGet("/sign-out", async (HttpContext context) =>
        {
            var user = context.User;
            if (user is null)
            {
                return Results.Unauthorized();
            }

            await context.SignOutAsync(IdentityConstants.ApplicationScheme);
            return Results.Ok();
        }).RequireAuthorization();

        return group;
    }
}