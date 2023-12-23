using LearnNew.Authorization;
using LearnNew.Models.Entities;
using LearnNew.Models.Requests.Create;
using LearnNew.Models.Requests.Update;
using LearnNew.Repositories.Interfaces;

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace LearnNew.WebApi.Extensions.MapExtensions;

public static class MapLessonsExtensions
{
    public static IEndpointRouteBuilder MapLessons(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/lessons")
            .WithOpenApi()
            .WithTags("Lessons");

        group.MapGet("/", async (ILessonRepository repository) =>
        {
            var result = await repository.GetAllAsync();

            return result is null
                ? Results.NotFound()
                : TypedResults.Ok(result);
        }).Produces<IEnumerable<Lesson>>();


        group.MapGet("/by-course-id/{courseId}", async (
            int courseId,
            HttpContext context,
            ILessonRepository repository,
            ICourseRepository courseRepository) =>
        {
            var course = await courseRepository.GetByIdAsync(courseId);

            if (course is null)
            {
                return Results.BadRequest($"No course with id = {courseId}");
            }

            if (context.User.Claims.FirstOrDefault(c => c.Type == "id")?.Value == course.Id.ToString())
            {
                var lessons = await repository.GetAllByCourseIdAsync(courseId);

                return lessons is null
                    ? Results.NotFound()
                    : TypedResults.Ok(lessons);
            }

            var result = await repository.GetVisibleByCourseIdAsync(courseId);
            return result is null
                ? Results.NotFound()
                : TypedResults.Ok(result);
        }).Produces<IEnumerable<Lesson>>();


        group.MapGet("/{id}", async (
            int id,
            ILessonRepository repository) =>
        {
            var result = await repository.GetByIdAsync(id);

            return result is null
                ? Results.NotFound()
                : TypedResults.Ok(result);
        }).Produces<Lesson>();

        group.MapPost("/", async (
            [FromBody] CreateLessonRequest request,
            ILessonRepository repository) =>
        {
            var lesson = await repository.CreateAsync(request);

            return Results.Created($"/{lesson.Id}", lesson);
        }).RequireAuthorization();

        group.MapDelete("/{id}", async (
            int id,
            HttpContext context,
            IAuthorizationService authorizationService,
            ILessonRepository repository) =>
        {
            if (!context.User.Identity?.IsAuthenticated ?? true)
            {
                return Results.Challenge();
            }

            var lesson = await repository.GetByIdAsync(id);

            var authorizationResult = await authorizationService.AuthorizeAsync(
                context.User,
                lesson,
                AuthorizationPolicies.SameAuthor);

            if (!authorizationResult.Succeeded)
            {
                return Results.Forbid();
            }
            if (lesson is null)
            {
                return Results.NoContent();
            }
            if (lesson.Id != id)
            {
                return Results.BadRequest("Object id from body is not equal to id from parameters");
            }

            await repository.DeleteAsync(id);

            return Results.Ok();
        });

        group.MapPut("/{id}", async (
            int id,
            [FromBody] UpdateLessonRequest request,
            HttpContext context,
            ILessonRepository repository,
            IAuthorizationService authorizationService) =>
        {
            if (!context.User.Identity?.IsAuthenticated ?? true)
            {
                return Results.Challenge();
            }

            var lesson = await repository.GetByIdAsync(id);

            var authorizationResult = await authorizationService.AuthorizeAsync(
                context.User,
                lesson,
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