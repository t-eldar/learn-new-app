using LearnNew.Models.Authentication;

namespace LearnNew.Models.Interfaces;

public interface IResource
{
    string UserId { get; set; }
    User? User { get; set; }
}
