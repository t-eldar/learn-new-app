namespace LearnNew.Models.Requests.Create;

public record CreateLessonRequest
{
    public required bool IsHidden { get; set; }
    public required string Title { get; set; }
    public required string Content { get; set; }
    public required int CourseId { get; set; }
    public required string UserId { get; set; }
}
