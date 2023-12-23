using LearnNew.Repositories.Interfaces;
using LearnNew.Models.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using LearnNew.Authorization;
using LearnNew.Models.Requests.Create;
using LearnNew.Models.Requests.Update;
using LearnNew.Models.Requests;

namespace LearnNew.WebApi.Extensions.MapExtensions;

public static class MapAnswersExtensions
{
    public static IEndpointRouteBuilder MapAnswers(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/answers")
            .WithOpenApi()
            .WithTags("Answers");

        group.MapGet("/by-question-id/{questionId}", async (
            int questionId,
            IAnswerRepository repository) =>
        {
            var result = await repository.GetAllByQuestionIdAsync(questionId);

            return result is null
                ? Results.NotFound()
                : TypedResults.Ok(result);
        }).Produces<IEnumerable<Answer>>();

        group.MapGet("/by-test-id/{testId}", async (
            int testId, 
            IAnswerRepository repository) =>
        {
            var result = await repository.GetAllByTestIdAsync(testId);

            return result is null
                ? Results.NotFound()
                : TypedResults.Ok(result);
        }).Produces<IEnumerable<Answer>>();

        group.MapGet("/by-test-id/{testId}/correct", async (
            int testId, 
            IAnswerRepository repository) =>
        {
            var result = await repository.GetCorrectByTestIdAsync(testId);

            return result is null
                ? Results.NotFound()
                : TypedResults.Ok(result);
        }).Produces<IEnumerable<Answer>>();

        group.MapGet("/by-question-id/{questionId}/correct", async (
            int questionId, 
            IAnswerRepository repository) =>
        {
            var result = await repository.GetCorrectByQuestionIdAsync(questionId);

            return result is null
                ? Results.NotFound()
                : TypedResults.Ok(result);
        }).Produces<Answer>();

        group.MapGet("/{id}", async (int id, IAnswerRepository repository) =>
        {
            var result = await repository.GetByIdAsync(id);

            return result is null
                ? Results.NotFound()
                : TypedResults.Ok(result);
        }).Produces<Answer>();

        group.MapPost("/", async (
            [FromBody] CreateAnswerRequest request,
            IAnswerRepository repository) =>
        {
            var answer = await repository.CreateAsync(request);

            return Results.Created($"/{answer.Id}", answer);
        }).RequireAuthorization();

        group.MapPut("/{id}", async (
            int id,
            [FromBody] UpdateAnswerRequest request,
            HttpContext context,
            IAnswerRepository repository,
            IAuthorizationService authorizationService) =>
        {
            if (!context.User.Identity?.IsAuthenticated ?? true)
            {
                return Results.Challenge();
            }

            var answer = await repository.GetByIdAsync(id);

            var authorizationResult = await authorizationService.AuthorizeAsync(
                context.User,
                answer,
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

        group.MapDelete("/{id}", async (
            int id,
            HttpContext context,
            IAuthorizationService authorizationService,
            IAnswerRepository repository) =>
        {
            if (!context.User.Identity?.IsAuthenticated ?? true)
            {
                return Results.Challenge();
            }

            var answer = await repository.GetByIdAsync(id);

            var authorizationResult = await authorizationService.AuthorizeAsync(
                context.User, 
                answer,
                AuthorizationPolicies.SameAuthor);

            if (!authorizationResult.Succeeded)
            {
                return Results.Forbid();
            }
            if (answer is null)
            {
                return Results.NoContent();
            }
            if (answer.Id != id)
            {
                return Results.BadRequest("Object id from body is not equal to id from parameters");
            }

            await repository.DeleteAsync(id);

            return Results.Ok();
        });

        return group;
    }
}