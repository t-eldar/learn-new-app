using LearnNew.Authorization;
using LearnNew.Models.Entities;
using LearnNew.Models.Requests.Create;
using LearnNew.Models.Requests.Update;
using LearnNew.Repositories.Interfaces;

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace LearnNew.WebApi.Extensions.MapExtensions;

public static class MapTestsExtensions
{
    public static IEndpointRouteBuilder MapTests(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/tests")
            .WithOpenApi()
            .WithTags("Tests");

        group.MapGet("/", async (ITestRepository repository) =>
        {
            var result = await repository.GetAllAsync();

            return result is null
                ? Results.NotFound()
                : TypedResults.Ok(result);
        }).Produces<IEnumerable<Test>>();

        group.MapGet("/by-lesson-id/{lessonId}", async (
            int lessonId,
            ITestRepository repository) =>
        {
            var result = await repository.GetByLessonIdAsync(lessonId);

            return result is null
                ? Results.NotFound()
                : TypedResults.Ok(result);
        }).Produces<IEnumerable<Test>>();


        group.MapGet("/{id}", async (
            int id,
            ITestRepository repository) =>
        {
            var result = await repository.GetByIdAsync(id);

            return result is null
                ? Results.NotFound()
                : TypedResults.Ok(result);
        }).Produces<Test>();

        group.MapDelete("/{id}", async (
            int id,
            HttpContext context,
            IAuthorizationService authorizationService,
            ITestRepository repository) =>
        {
            if (!context.User.Identity?.IsAuthenticated ?? true)
            {
                return Results.Challenge();
            }

            var test = await repository.GetByIdAsync(id);

            var authorizationResult = await authorizationService.AuthorizeAsync(
                context.User,
                test,
                AuthorizationPolicies.SameAuthor);

            if (!authorizationResult.Succeeded)
            {
                return Results.Forbid();
            }
            if (test is null)
            {
                return Results.NoContent();
            }
            if (test.Id != id)
            {
                return Results.BadRequest("Object id from body is not equal to id from parameters");
            }

            await repository.DeleteAsync(id);

            return Results.Ok();
        });

        group.MapPost("/create-empty", async (
            [FromBody] CreateEmptyTestRequest request,
            ITestRepository repository) =>
        {
            var test = await repository.CreateAsync(request);

            return test is null
                ? Results.BadRequest("Incorrect request body")
                : Results.Created($"/{test.Id}", test);
        }).RequireAuthorization();


        group.MapPost("/create-full", async (
            [FromBody] CreateFullTestRequest request,
            ITestRepository repository) =>
        {
            var test = await repository.CreateAsync(request);

            return test is null
                ? Results.BadRequest("Incorrect request body")
                : Results.Created($"/{test.Id}", test);
        }).RequireAuthorization();

        group.MapPut("/{id}", async (
            int id,
            [FromBody] UpdateTestRequest request,
            HttpContext context,
            ITestRepository repository,
            IAuthorizationService authorizationService) =>
        {
            if (!context.User.Identity?.IsAuthenticated ?? true)
            {
                return Results.Challenge();
            }

            var test = await repository.GetByIdAsync(id);

            var authorizationResult = await authorizationService.AuthorizeAsync(
                context.User,
                test,
                AuthorizationPolicies.SameAuthor);

            if (!authorizationResult.Succeeded)
            {
                return Results.Forbid();
            }
            if (request.Id != id)
            {
                return Results.BadRequest("Object id from body is not equal to id from parameters");
            }

            await repository.UpdateAsync(request);

            return Results.Ok();
        });

        return group;
    }
}