using LearnNew.Models.Authentication;
using LearnNew.Models.Interfaces;

namespace LearnNew.Models.Entities;

public class Answer : IResource
{
    public int Id { get; set; }
    public required string Text { get; set; }
    public required bool IsCorrect { get; set; }

    public required int QuestionId { get; set; }
    public Question? Question { get; set; }
    
    public required string UserId { get; set; }
    public User? User { get; set; }
}
