using LearnNew.Models.Entities;
using LearnNew.Models.Requests.Create;
using LearnNew.Models.Requests.Update;

namespace LearnNew.Repositories.Interfaces;
public interface ITestRepository
{
    Task<IEnumerable<Test>?> GetAllAsync();
    Task<IEnumerable<Test>?> GetByLessonIdAsync(int lessonId);
    Task<Test?> GetByIdAsync(int id);
    Task<Test> CreateAsync(CreateEmptyTestRequest request);
    Task<Test> CreateAsync(CreateFullTestRequest request);
    Task<Test> CreateAsync(Test test);
    Task DeleteAsync(int id);
    Task UpdateAsync(UpdateTestRequest request);
}
