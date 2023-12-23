using LearnNew.Models.Entities;
using LearnNew.Models.Requests.Create;
using LearnNew.Models.Requests.Update;

namespace LearnNew.Repositories.Interfaces;
public interface IQuestionScoreRepository
{
    Task<IEnumerable<QuestionScore>?> GetAllAsync();
    Task<IEnumerable<QuestionScore>?> GetByTestScoreIdAsync(int testScoreId);
    Task<QuestionScore?> GetByUserAndQuestionIdAsync(string userId, int questionId);
    Task<QuestionScore?> GetByIdAsync(int id);

    Task<QuestionScore> CreateAsync(CreateQuestionScoreRequest request);
    Task<QuestionScore> CreateAsync(QuestionScore questionScore);
    Task UpdateAsync(UpdateQuestionScoreRequest request);
    Task DeleteAsync(int id);
}
