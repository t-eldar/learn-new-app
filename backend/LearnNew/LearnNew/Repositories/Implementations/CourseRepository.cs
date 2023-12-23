using Azure.Core;

using LearnNew.DatabaseContext;
using LearnNew.Models.Entities;
using LearnNew.Models.Requests.Create;
using LearnNew.Models.Requests.Update;
using LearnNew.Repositories.Interfaces;
using LearnNew.Services.Interfaces;

using Microsoft.EntityFrameworkCore;

namespace LearnNew.Repositories.Implementations;
public class CourseRepository : ICourseRepository
{
    private readonly IApplicationContext _applicationContext;
    private readonly IDateTimeProvider _dateTimeProvider;
    public CourseRepository(
        IApplicationContext applicationContext,
        IDateTimeProvider dateTimeProvider)
    {
        _applicationContext = applicationContext;
        _dateTimeProvider = dateTimeProvider;
    }

    public async Task<IEnumerable<Course>?> GetAllAsync() => await _applicationContext.Courses.ToArrayAsync();
    public async Task<Course?> GetByIdAsync(int id) => await _applicationContext.Courses.FirstOrDefaultAsync(c => c.Id == id);
    public async Task<IEnumerable<Course>?> GetByTeacherIdAsync(string creatorId) => await _applicationContext
        .Courses
        .Where(c => c.UserId == creatorId)
        .ToArrayAsync();
    public async Task<Course> CreateAsync(CreateCourseRequest request)
    {
        ArgumentNullException.ThrowIfNull(request);

        var course = new Course
        {
            CoverImageUrl = request.CoverImageUrl,
            UserId = request.UserId,
            Name = request.Name,
            Description = request.Description,
            DateCreated = _dateTimeProvider.GetCurrentUtc(),
        };

        await _applicationContext.Courses.AddAsync(course);
        await _applicationContext.SaveChangesAsync();

        return course;
    }
    public async Task DeleteAsync(int id)
    {
        var course = await _applicationContext.Courses.FirstOrDefaultAsync(c => c.Id == id);
        if (course is null)
        {
            return;
        }

        _applicationContext.Courses.Remove(course);
        await _applicationContext.SaveChangesAsync();
    }
    public async Task UpdateAsync(UpdateCourseRequest request)
    {
        ArgumentNullException.ThrowIfNull(request);

        var course = await _applicationContext.Courses.FirstOrDefaultAsync(c => c.Id == request.Id)
            ?? throw new Exception($"Cannot find request with id == {request.Id}");

        course.Name = request.Name ?? course.Name;
        course.Description = request.Description ?? course.Description;
        course.CoverImageUrl = request.CoverImageUrl ?? course.CoverImageUrl;

        await _applicationContext.SaveChangesAsync();
    }

    public async Task<Course> CreateAsync(Course course)
    {
        ArgumentNullException.ThrowIfNull(course);

        await _applicationContext.Courses.AddAsync(course);
        await _applicationContext.SaveChangesAsync();

        return course;
    }
}
