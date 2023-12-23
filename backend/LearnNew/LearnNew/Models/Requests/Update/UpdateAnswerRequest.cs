namespace LearnNew.Models.Requests.Update;

public record UpdateAnswerRequest
{
    public required int Id { get; set; }
    public string? Text { get; set; }
    public int? QuestionId { get; set; }
    public bool? IsCorrect { get; set; }
}