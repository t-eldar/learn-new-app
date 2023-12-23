using LearnNew.Models.Authentication;
using LearnNew.Models.Interfaces;

namespace LearnNew.Models.Entities;
public class Question : IResource
{
    public int Id { get; set; }
    public required string Content { get; set; }
    public required bool AreAnswersChoicable { get; set; }
    
    public required int TestId { get; set; }
    public Test? Test { get; set; }
    
    public required string UserId { get; set; }
    public User? User { get; set; }
   
    public IEnumerable<Answer>? Answers { get; set; }
}
