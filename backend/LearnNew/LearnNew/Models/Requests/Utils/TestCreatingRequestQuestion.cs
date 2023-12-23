namespace LearnNew.Models.Requests.Utils;

public class TestCreatingRequestQuestion
{
    public required string Content { get; set; }
    public required bool AreAnswersChoicable { get; set; }
    public required IEnumerable<QuestionCreatingRequestAnswer> Answers { get; set; }
}
