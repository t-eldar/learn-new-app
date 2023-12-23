namespace LearnNew.Models.Requests.Update;

public record UpdateQuestionScoreRequest
{
    public required int Id { get; set; }
    public bool? IsCorrect { get; set; }
    public string? UserAnswerText { get; set; }
}
