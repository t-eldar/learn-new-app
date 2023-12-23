using LearnNew.Models.Entities;
using LearnNew.Models.Requests.Create;
using LearnNew.Models.Requests.Update;

namespace LearnNew.Repositories.Interfaces;
public interface IQuestionRepository
{
    Task<IEnumerable<Question>?> GetByTestIdAsync(int testId);
    Task<Question?> GetByIdAsync(int id);
    Task<Question> CreateAsync(CreateEmptyQuestionRequest request);
    Task<Question> CreateAsync(Question question);
    Task DeleteAsync(int id);
    Task UpdateAsync(UpdateQuestionRequest request);
}
