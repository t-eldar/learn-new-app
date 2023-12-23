namespace LearnNew.Models.Requests.Update;

public record UpdateTestScoreRequest
{
    public required int Id { get; set; }
    public required int Score { get; set; }
}
