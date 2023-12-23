using LearnNew.Models.Entities;

using Microsoft.AspNetCore.Identity;

namespace LearnNew.Models.Authentication;
public class User : IdentityUser
{
    public required string Name { get; set; }
    public required string Surname { get; set; }

    public IEnumerable<TestScore>? Scores { get; set; }
    public IEnumerable<Course>? Courses { get; set; }
}
