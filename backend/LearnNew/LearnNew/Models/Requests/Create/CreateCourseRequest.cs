namespace LearnNew.Models.Requests.Create;

public record CreateCourseRequest
{
    public string? CoverImageUrl { get; set; }
    public required string UserId { get; set; }
    public required string Name { get; set; }
    public required string Description { get; set; }
}