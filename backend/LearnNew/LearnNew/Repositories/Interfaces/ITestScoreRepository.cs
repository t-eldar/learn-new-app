using LearnNew.Models.Entities;
using LearnNew.Models.Requests.Create;
using LearnNew.Models.Requests.Update;

namespace LearnNew.Repositories.Interfaces;
public interface ITestScoreRepository
{
    Task<IEnumerable<TestScore>?> GetAllAsync();
    Task<TestScore?> GetByUserAndTestIdAsync(string userId, int testId);
    Task<TestScore?> GetByIdAsync(int id);

    Task<TestScore> CreateAsync(CreateTestScoreRequest request);
    Task<TestScore> CreateAsync(TestScore testScore);
    Task UpdateAsync(UpdateTestScoreRequest request);
    Task DeleteAsync(int id);
}
