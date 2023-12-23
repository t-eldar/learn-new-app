using LearnNew.Models.Requests.Utils;

namespace LearnNew.Models.Requests;

public record CheckTestRequest
{
    public required int TestId { get; set; }
    public required IEnumerable<CheckTestRequestAnswer> AnswerRequests { get; set; }
}
