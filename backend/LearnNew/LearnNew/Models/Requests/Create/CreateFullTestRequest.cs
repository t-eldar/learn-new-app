using LearnNew.Models.Requests.Utils;

namespace LearnNew.Models.Requests.Create;

public class CreateFullTestRequest : ICreateTestRequest
{
    public required string Title { get; set; }
    public required int LessonId { get; set; }
    public required string UserId { get; set; }
    public required IEnumerable<TestCreatingRequestQuestion> Questions { get; set; }
}
