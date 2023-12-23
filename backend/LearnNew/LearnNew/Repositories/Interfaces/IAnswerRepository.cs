using LearnNew.Models.Entities;
using LearnNew.Models.Requests;
using LearnNew.Models.Requests.Create;
using LearnNew.Models.Requests.Update;

namespace LearnNew.Repositories.Interfaces;
public interface IAnswerRepository
{
    Task<IEnumerable<Answer>?> GetAllByQuestionIdAsync(int questionId);
    Task<IEnumerable<Answer>?> GetAllByTestIdAsync(int testId);
    Task<IEnumerable<Answer>?> GetCorrectByTestIdAsync(int testId);
    Task<Answer?> GetCorrectByQuestionIdAsync(int questionId);
    Task<Answer?> GetByIdAsync(int id);
    Task<Answer> CreateAsync(CreateAnswerRequest request);
    Task<Answer> CreateAsync(Answer answer);
    Task DeleteAsync(int id);
    Task UpdateAsync(UpdateAnswerRequest request);
}
