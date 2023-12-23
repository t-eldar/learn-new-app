using LearnNew.Authorization;
using LearnNew.Models.Entities;
using LearnNew.Models.Requests.Create;
using LearnNew.Repositories.Interfaces;

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace LearnNew.WebApi.Extensions.MapExtensions;

public static class MapTestScoresExtensions
{
    public static IEndpointRouteBuilder MapTestScores(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/test-scores")
            .WithOpenApi()
            .WithTags("Test Scores");

        group.MapGet("/", async (ITestScoreRepository repository) =>
        {
            var result = await repository.GetAllAsync();

            return result is null
                ? Results.NotFound()
                : TypedResults.Ok(result);
        }).Produces<IEnumerable<TestScore>>();

        group.MapGet("/by-user-and-test-ids/{userId}&{testId}", async (
            string userId,
            int testId,
            ITestScoreRepository repository) =>
        {
            var result = await repository.GetByUserAndTestIdAsync(userId, testId);

            return result is null
                ? Results.NotFound()
                : TypedResults.Ok(result);
        }).Produces<TestScore>();

        group.MapGet("/{id}", async (
           int id,
           ITestScoreRepository repository) =>
        {
            var result = await repository.GetByIdAsync(id);

            return result is null
                ? Results.NotFound()
                : TypedResults.Ok(result);
        }).Produces<TestScore>();


        group.MapPost("/", async (
            [FromBody] CreateTestScoreRequest request,
            ITestScoreRepository repository) =>
        {
            var score = await repository.CreateAsync(request);

            return Results.Created($"/{score.Id}", score);
        }).RequireAuthorization();

        group.MapDelete("/{id}", async (
            int id,
            HttpContext context,
            IAuthorizationService authorizationService,
            ITestScoreRepository repository) =>
        {
            if (!context.User.Identity?.IsAuthenticated ?? true)
            {
                return Results.Challenge();
            }

            var score = await repository.GetByIdAsync(id);

            var authorizationResult = await authorizationService.AuthorizeAsync(
                context.User,
                score,
                AuthorizationPolicies.SameAuthor);

            if (!authorizationResult.Succeeded)
            {
                return Results.Forbid();
            }
            if (score is null)
            {
                return Results.NoContent();
            }
            if (score.Id != id)
            {
                return Results.BadRequest("Object id from body is not equal to id from parameters");
            }

            await repository.DeleteAsync(id);

            return Results.Ok();
        });

        return group;
    }
}