using LearnNew.Models.Requests.Utils;

namespace LearnNew.Models.Requests.Create;

public record CreateQuestionWithAnswersRequest
{
    public required string Content { get; set; }
    public required bool AreAnswersChoicable { get; set; }
    public required int TestId { get; set; }
    public required string UserId { get; set; }
    public required IEnumerable<QuestionCreatingRequestAnswer> Answers { get; set; }
}
