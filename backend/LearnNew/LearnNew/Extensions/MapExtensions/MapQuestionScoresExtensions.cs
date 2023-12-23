using LearnNew.Authorization;
using LearnNew.Models.Entities;
using LearnNew.Models.Requests.Create;
using LearnNew.Repositories.Interfaces;

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace LearnNew.WebApi.Extensions.MapExtensions;

public static class MapQuestionScoresExtensions
{
    public static IEndpointRouteBuilder MapQuestionScores(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/question-scores")
            .WithOpenApi()
            .WithTags("Question Scores");

        group.MapGet("/", async (IQuestionScoreRepository repository) =>
        {
            var result = await repository.GetAllAsync();

            return result is null
                ? Results.NotFound()
                : TypedResults.Ok(result);
        }).Produces<IEnumerable<QuestionScore>>();

        group.MapGet("/by-test-score-id/{testScoreId}", async (
            int testScoreId,
            IQuestionScoreRepository repository) =>
        {
            var result = await repository.GetByTestScoreIdAsync(testScoreId);

            return result is null
                ? Results.NotFound()
                : TypedResults.Ok(result);
        }).Produces<IEnumerable<QuestionScore>>();

        group.MapGet("/by-user-and-question-ids/{userId}&{questionId}", async (
            string userId,
            int questionId,
            IQuestionScoreRepository repository) =>
        {
            var result = await repository.GetByUserAndQuestionIdAsync(userId, questionId);

            return result is null
                ? Results.NotFound()
                : TypedResults.Ok(result);
        }).Produces<QuestionScore>();

        group.MapGet("/{id}", async (
            int id,
            IQuestionScoreRepository repository) =>
        {
            var result = await repository.GetByIdAsync(id);

            return result is null
                ? Results.NotFound()
                : TypedResults.Ok(result);
        }).Produces<QuestionScore>();

        group.MapPost("/", async (
            [FromBody] CreateQuestionScoreRequest request,
            IQuestionScoreRepository repository) =>
        {
            var score = await repository.CreateAsync(request);

            return Results.Created($"/{score.Id}", score);
        }).RequireAuthorization();

        group.MapDelete("/{id}", async (
            int id,
            HttpContext context,
            IAuthorizationService authorizationService,
            IQuestionScoreRepository repository) =>
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