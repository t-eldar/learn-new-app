using LearnNew.Models.Authentication;
using LearnNew.Models.Interfaces;

namespace LearnNew.Models.Entities;
public class Course : IResource
{
    public int Id { get; set; }
    public required string Name { get; set; }
    public string? CoverImageUrl { get; set; }
    public required string Description { get; set; }
    public required DateTime DateCreated { get; set; }
   
    public required string UserId { get; set; }
    public User? User { get; set; }

    public IEnumerable<Lesson>? Lessons { get; set; }
}
