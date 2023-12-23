using LearnNew.Models.Authentication;
using LearnNew.Models.Interfaces;

namespace LearnNew.Models.Entities;
public class Test : IResource
{
    public int Id { get; set; }
    public required string Title { get; set; }

    public required int LessonId { get; set; }
    public Lesson? Lesson { get; set; }

    public required string UserId { get; set; }
    public User? User { get; set; }

    public IList<Question>? Questions { get; set; }
}
