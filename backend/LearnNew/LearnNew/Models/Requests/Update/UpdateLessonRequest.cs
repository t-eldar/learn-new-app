namespace LearnNew.Models.Requests.Update;

public record UpdateLessonRequest
{
    public bool? IsHidden { get; set; }
    public required int Id { get; set; }
    public string? Title { get; set; }
    public string? Content { get; set; }
    public int? CourseId { get; set; }
}
