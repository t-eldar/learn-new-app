namespace LearnNew.Models.Requests.Update;

public record UpdateCourseRequest
{
    public required int Id { get; set; }
    public string? Name { get; set; }
    public string? Description { get; set; }
    public string? CoverImageUrl { get; set; }
}
