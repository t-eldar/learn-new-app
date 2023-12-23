using LearnNew.Authorization;
using LearnNew.Models.Entities;
using LearnNew.Models.Requests.Create;
using LearnNew.Models.Requests.Update;
using LearnNew.Repositories.Interfaces;

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace LearnNew.WebApi.Extensions.MapExtensions;

public static class MapCoursesExtensions
{
    public static IEndpointRouteBuilder MapCourses(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/courses")
            .WithOpenApi()
            .WithTags("Courses");

        group.MapGet("/", async (ICourseRepository repository) =>
        {
            var result = await repository.GetAllAsync();

            return result is null
                ? Results.NotFound()
                : TypedResults.Ok(result);
        }).Produces<IEnumerable<Course>>();

        group.MapGet("/by-teacher-id/{teacherId}", async (
            string teacherId,
            ICourseRepository repository) =>
        {
            var result = await repository.GetByTeacherIdAsync(teacherId);

            return result is null
                ? Results.NotFound()
                : TypedResults.Ok(result);
        });

        group.MapGet("/{id}", async (
           int id,
           ICourseRepository repository) =>
        {
            var result = await repository.GetByIdAsync(id);

            return result is null
                ? Results.NotFound()
                : TypedResults.Ok(result);
        }).Produces<Course>();

        group.MapPost("/", async (
            [FromBody] CreateCourseRequest request,
            ICourseRepository repository) =>
        {
            var course = await repository.CreateAsync(request);

            return Results.Created($"/{course.Id}", course);
        }).RequireAuthorization();

        group.MapPut("/{id}", async (
            int id,
            [FromBody] UpdateCourseRequest request,
            HttpContext context,
            ICourseRepository repository,
            IAuthorizationService authorizationService) =>
        {
            if (!context.User.Identity?.IsAuthenticated ?? true)
            {
                return Results.Challenge();
            }

            var course = await repository.GetByIdAsync(id);
            
            var authorizationResult = await authorizationService.AuthorizeAsync(
                context.User,
                course, 
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
           ICourseRepository repository) =>
        {
            if (!context.User.Identity?.IsAuthenticated ?? true)
            {
                return Results.Challenge();
            }

            var course = await repository.GetByIdAsync(id);

            var authorizationResult = await authorizationService.AuthorizeAsync(
                context.User, 
                course,
                AuthorizationPolicies.SameAuthor);

            if (!authorizationResult.Succeeded)
            {
                return Results.Forbid();
            }
            if (course is null)
            {
                return Results.NoContent();
            }
            if (course.Id != id)
            {
                return Results.BadRequest("Object id from body is not equal to id from parameters");
            }

            await repository.DeleteAsync(id);

            return Results.Ok();
        });

        return group;
    }
}