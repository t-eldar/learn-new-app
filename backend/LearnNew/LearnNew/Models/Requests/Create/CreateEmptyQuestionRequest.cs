namespace LearnNew.Models.Requests.Create;

public record CreateEmptyQuestionRequest
{
    public required string Content { get; set; }
    public required int TestId { get; set; }
    public required bool AreAnswersChoicable { get; set; }
    public required string UserId { get; set; }
}
