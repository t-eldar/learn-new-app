using System.Security.Claims;

using LearnNew.Models.Authentication;

using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Options;

namespace LearnNew.Authentication;

public class ApplicationUserClaimsPrincipalFactory : UserClaimsPrincipalFactory<User>
{
    public ApplicationUserClaimsPrincipalFactory(
        UserManager<User> userManager,
        IOptions<IdentityOptions> optionsAccessor
    )
        : base(userManager, optionsAccessor) { }

    protected override Task<ClaimsIdentity> GenerateClaimsAsync(User user)
    {
        var identity = new ClaimsIdentity(IdentityConstants.ApplicationScheme);
        identity.AddClaim(new Claim("id", user.Id));
        identity.AddClaim(new Claim("name", user.Name));
        identity.AddClaim(new Claim("surname", user.Surname));
        identity.AddClaim(new Claim("email", user.Email!));

        return Task.FromResult(identity);
    }
}
