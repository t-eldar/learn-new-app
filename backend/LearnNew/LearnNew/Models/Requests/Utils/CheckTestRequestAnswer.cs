using LearnNew.Models.Entities;

namespace LearnNew.Models.Requests.Utils;

public record CheckTestRequestAnswer
{
    public required string UserId { get; set; }
    public required int QuestionId { get; set; }
    public required string AnswerText { get; set; }
}