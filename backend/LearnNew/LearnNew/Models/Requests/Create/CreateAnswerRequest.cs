namespace LearnNew.Models.Requests.Create;

public record CreateAnswerRequest
{
    public required string Text { get; set; }
    public required int QuestionId { get; set; }
    public required string UserId { get; set; }
    public required bool IsCorrect { get; set; }
}
