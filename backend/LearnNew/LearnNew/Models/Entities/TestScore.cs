using LearnNew.Models.Authentication;
using LearnNew.Models.Interfaces;

namespace LearnNew.Models.Entities;

public class TestScore : IResource
{
    public int Id { get; set; }
    public required DateTime TestingDate { get; set; }
    public required int Score { get; set; }
 
    public required string UserId { get; set; }
    public User? User { get; set; }
    
    public required int TestId { get; set; }
    public Test? Test { get; set; }
    
    public IEnumerable<QuestionScore>? QuestionScores { get; set; }
}
