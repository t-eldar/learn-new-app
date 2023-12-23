namespace LearnNew.Models.Requests.Update;

public record UpdateQuestionRequest
{
    public required int Id { get; set; }
    public string? Content { get; set; }
    public int? TestId { get; set; }
    public bool? AreAnswersChoicable { get; set; }
}
