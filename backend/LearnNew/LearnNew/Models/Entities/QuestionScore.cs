using LearnNew.Models.Authentication;
using LearnNew.Models.Interfaces;

namespace LearnNew.Models.Entities;

public class QuestionScore : IResource
{
    public int Id { get; set; }
    public required bool IsCorrect { get; set; }
    public required string UserAnswerText { get; set; }

    public required int TestScoreId { get; set; }
    public TestScore? TestScore { get; set; }

    public required string UserId { get; set; }
    public User? User { get; set; }

    public required int QuestionId { get; set; }
    public Question? Question { get; set; }
}
