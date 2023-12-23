namespace LearnNew.Models.Requests.Create;

public record CreateEmptyTestRequest : ICreateTestRequest
{
    public required string Title { get; set; }
    public required int LessonId { get; set; }
    public required string UserId { get; set; }
}