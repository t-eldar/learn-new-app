using LearnNew.Models.Entities;
using LearnNew.Models.Requests;
using LearnNew.Services.Interfaces;

using Microsoft.AspNetCore.Mvc;

namespace LearnNew.Extensions.MapExtensions;

public static class MapCheckTestsExtensions
{
    public static IEndpointRouteBuilder MapCheckTests(this IEndpointRouteBuilder app)
    {
        app.MapPost("/check-test", async (
            [FromBody] CheckTestRequest request,
            ITestService testService
        ) =>
        {
            var testScore = await testService.CheckTestAsync(request);

            return TypedResults.Ok(testScore);
        }).WithOpenApi()
            .WithTags("Check Tests")
            .Produces<TestScore>();

        return app;
    }
}
