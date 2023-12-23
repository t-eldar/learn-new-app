using Azure.Core;

using LearnNew.DatabaseContext;
using LearnNew.Models.Entities;
using LearnNew.Models.Requests.Create;
using LearnNew.Models.Requests.Update;
using LearnNew.Repositories.Interfaces;

using Microsoft.EntityFrameworkCore;

namespace LearnNew.Repositories.Implementations;
public class LessonRepository : ILessonRepository
{
    private readonly IApplicationContext _applicationContext;

    public LessonRepository(IApplicationContext applicationContext) => _applicationContext = applicationContext;
    public async Task<Lesson?> GetByIdAsync(int id) => await _applicationContext
        .Lessons
        .FirstOrDefaultAsync(l => l.Id == id);
    public async Task<IEnumerable<Lesson>?> GetAllAsync() => await _applicationContext
        .Lessons
        .ToArrayAsync();
    public async Task<IEnumerable<Lesson>?> GetVisibleByCourseIdAsync(int courseId) => await _applicationContext
        .Lessons
        .Where(l => l.CourseId == courseId && !l.IsHidden)
        .ToArrayAsync();
    public async Task<IEnumerable<Lesson>?> GetAllByCourseIdAsync(int courseId) => await _applicationContext
    .Lessons
    .Where(l => l.CourseId == courseId)
    .ToArrayAsync();

    public async Task<Lesson> CreateAsync(CreateLessonRequest request)
    {
        ArgumentNullException.ThrowIfNull(request);

        var lesson = new Lesson
        {
            IsHidden = request.IsHidden,
            Content = request.Content,
            Title = request.Title,
            CourseId = request.CourseId,
            UserId = request.UserId,
        };

        await _applicationContext.Lessons.AddAsync(lesson);
        await _applicationContext.SaveChangesAsync();

        return lesson;
    }
    public async Task DeleteAsync(int id)
    {
        var lesson = await _applicationContext.Lessons.FirstOrDefaultAsync(l => l.Id == id);
        if (lesson is null)
        {
            return;
        }

        _applicationContext.Lessons.Remove(lesson);
        await _applicationContext.SaveChangesAsync();
    }
    public async Task UpdateAsync(UpdateLessonRequest request)
    {
        ArgumentNullException.ThrowIfNull(request);

        var lesson = await _applicationContext.Lessons.FirstOrDefaultAsync(c => c.Id == request.Id)
            ?? throw new Exception($"Cannot find request with id == {request.Id}");

        lesson.CourseId = request.CourseId ?? lesson.CourseId;
        lesson.Title = request.Title ?? lesson.Title;
        lesson.Content = request.Content ?? lesson.Content;
        lesson.IsHidden = request.IsHidden ?? lesson.IsHidden;

        await _applicationContext.SaveChangesAsync();
    }

    public async Task<Lesson> CreateAsync(Lesson lesson)
    {
        ArgumentNullException.ThrowIfNull(lesson);

        await _applicationContext.Lessons.AddAsync(lesson);
        await _applicationContext.SaveChangesAsync();

        return lesson;
    }
}
