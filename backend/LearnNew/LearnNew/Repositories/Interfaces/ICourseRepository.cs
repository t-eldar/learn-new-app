using LearnNew.Models.Entities;
using LearnNew.Models.Requests.Create;
using LearnNew.Models.Requests.Update;

namespace LearnNew.Repositories.Interfaces;
public interface ICourseRepository
{
    Task<IEnumerable<Course>?> GetAllAsync();
    Task<IEnumerable<Course>?> GetByTeacherIdAsync(string teacherId);
    Task<Course?> GetByIdAsync(int id);
    Task<Course> CreateAsync(CreateCourseRequest request);
    Task<Course> CreateAsync(Course course);
    Task DeleteAsync(int id);
    Task UpdateAsync(UpdateCourseRequest request);
}
