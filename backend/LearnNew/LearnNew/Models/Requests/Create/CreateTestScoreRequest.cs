namespace LearnNew.Models.Requests.Create;

public record CreateTestScoreRequest
{
    public required string UserId { get; set; }
    public required int TestId { get; set; }
    public required int Score { get; set; }
}