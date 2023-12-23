using LearnNew.Models.Authentication;
using LearnNew.Models.Interfaces;

namespace LearnNew.Models.Entities;
public class Lesson : IResource
{
    public int Id { get; set; }
    public required string Title { get; set; }
    public required string Content { get; set; }
    public required bool IsHidden { get; set; }
   
    public required int CourseId { get; set; }
    public Course? Course { get; set; } 
    
    public required string UserId { get; set; }
    public User? User { get; set; }

    public IEnumerable<Test>? Tests { get; set; }
}
