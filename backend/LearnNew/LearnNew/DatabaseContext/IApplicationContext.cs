using LearnNew.Models.Authentication;
using LearnNew.Models.Entities;
using Microsoft.EntityFrameworkCore;

namespace LearnNew.DatabaseContext;

public interface IApplicationContext
{
    DbSet<TestScore> TestScores { get; set; }
    DbSet<QuestionScore> QuestionScores { get; set; }
    DbSet<User> Users { get; set; }
    DbSet<Lesson> Lessons { get; set; }
    DbSet<Course> Courses { get; set; }
    DbSet<Answer> Answers { get; set; }
    DbSet<Question> Questions { get; set; }
    DbSet<Test> Tests { get; set; }

    Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
}
