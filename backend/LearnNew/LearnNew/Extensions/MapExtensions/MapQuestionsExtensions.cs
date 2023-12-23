using LearnNew.Authorization;
using LearnNew.Models.Entities;
using LearnNew.Models.Requests.Create;
using LearnNew.Models.Requests.Update;
using LearnNew.Repositories.Interfaces;

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace LearnNew.WebApi.Extensions.MapExtensions;

public static class MapQuestionsExtensions
{
    public static IEndpointRouteBuilder MapQuestions(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/questions")
            .WithOpenApi()
            .WithTags("Questions");

        group.MapGet("/by-test-id/{testId}", async (
            int testId,
            IQuestionRepository repository) =>
        {
            var result = await repository.GetByTestIdAsync(testId);

            return result is null
                ? Results.NotFound()
                : TypedResults.Ok(result);
        }).Produces<IEnumerable<Question>>();

        group.MapGet("/{id}", async (
           int id,
           IQuestionRepository repository) =>
        {
            var result = await repository.GetByIdAsync(id);

            return result is null
                ? Results.NotFound()
                : TypedResults.Ok(result);
        }).Produces<Question>();


        group.MapPost("/", async (
            [FromBody] CreateEmptyQuestionRequest request,
            IQuestionRepository repository) =>
        {
            var question = await repository.CreateAsync(request);

            return Results.Created($"/{question.Id}", question);
        }).RequireAuthorization();

        group.MapDelete("/{id}", async (
            int id,
            HttpContext context,
            IAuthorizationService authorizationService,
            IQuestionRepository repository) =>
        {
            if (!context.User.Identity?.IsAuthenticated ?? true)
            {
                return Results.Challenge();
            }

            var question = await repository.GetByIdAsync(id);

            var authorizationResult = await authorizationService.AuthorizeAsync(
                context.User,
                question,
                AuthorizationPolicies.SameAuthor);

            if (!authorizationResult.Succeeded)
            {
                return Results.Forbid();
            }
            if (question is null)
            {
                return Results.NoContent();
            }
            if (question.Id != id)
            {
                return Results.BadRequest("Object id from body is not equal to id from parameters");
            }

            await repository.DeleteAsync(id);

            return Results.Ok();
        });

        group.MapPut("/{id}", async (
            int id,
            [FromBody] UpdateQuestionRequest request,
            HttpContext context,
            IQuestionRepository repository,
            IAuthorizationService authorizationService) =>
        {
            if (!context.User.Identity?.IsAuthenticated ?? true)
            {
                return Results.Challenge();
            }

            var question = await repository.GetByIdAsync(id);

            var authorizationResult = await authorizationService.AuthorizeAsync(
                context.User,
                question,
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