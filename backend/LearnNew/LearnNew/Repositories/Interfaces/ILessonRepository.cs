using LearnNew.Models.Entities;
using LearnNew.Models.Requests.Create;
using LearnNew.Models.Requests.Update;

namespace LearnNew.Repositories.Interfaces;
public interface ILessonRepository
{
    Task<IEnumerable<Lesson>?> GetAllAsync();
    Task<IEnumerable<Lesson>?> GetVisibleByCourseIdAsync(int courseId);
    Task<IEnumerable<Lesson>?> GetAllByCourseIdAsync(int courseId);
    Task<Lesson?> GetByIdAsync(int id);
    Task<Lesson> CreateAsync(CreateLessonRequest request);
    Task<Lesson> CreateAsync(Lesson lesson);
    Task DeleteAsync(int id);
    Task UpdateAsync(UpdateLessonRequest request);
}
