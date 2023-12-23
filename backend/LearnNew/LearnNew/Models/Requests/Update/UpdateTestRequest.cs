namespace LearnNew.Models.Requests.Update;

public record UpdateTestRequest
{
    public required int Id { get; set; }
    public string? Title { get; set; }
    public int? LessonId { get; set; }
}
