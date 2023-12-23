using LearnNew.Authorization.Requirements;
using LearnNew.Models.Interfaces;

using Microsoft.AspNetCore.Authorization;

namespace LearnNew.Authorization.Handlers;

public class ResourceAuthorizationHandler : AuthorizationHandler<SameAuthorRequirement, IResource>
{
    protected override Task HandleRequirementAsync(
        AuthorizationHandlerContext context,
        SameAuthorRequirement requirement,
        IResource resource
    )
    {
        var userId = context.User.Claims.FirstOrDefault(c => c.Type == "id")?.Value;

        if (userId == resource.UserId)
        {
            context.Succeed(requirement);
        }

        return Task.CompletedTask;
    }
}
