namespace LearnNew.Models.Requests.Utils;

public record QuestionCreatingRequestAnswer
{
    public required string Text { get; set; }
    public required bool IsCorrect { get; set; }
}