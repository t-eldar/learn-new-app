using LearnNew.Models.Authentication;
using LearnNew.Models.Entities;

using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace LearnNew.DatabaseContext;
public class ApplicationContext : IdentityDbContext<User>, IApplicationContext
{
    public DbSet<TestScore> TestScores { get; set; }
    public DbSet<QuestionScore> QuestionScores { get; set; }
    public DbSet<Lesson> Lessons { get; set; }
    public DbSet<Course> Courses { get; set; }
    public DbSet<Answer> Answers { get; set; }
    public DbSet<Question> Questions { get; set; }
    public DbSet<Test> Tests { get; set; }

    public ApplicationContext(DbContextOptions dbContextOptions)
        : base(dbContextOptions)
    {
        Database.EnsureCreated();
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<TestScore>(entity =>
        {
            entity.HasOne(s => s.User)
                .WithMany()
                .HasForeignKey(s => s.UserId)
                .OnDelete(DeleteBehavior.NoAction);

            entity.HasOne(s => s.Test)
                .WithMany()
                .HasForeignKey(s => s.TestId)
                .OnDelete(DeleteBehavior.NoAction);
        });
        modelBuilder.Entity<QuestionScore>(entity =>
        {
            entity.HasOne(s => s.User)
                .WithMany()
                .HasForeignKey(s => s.UserId)
                .OnDelete(DeleteBehavior.NoAction);
            entity.HasOne(s => s.TestScore)
                .WithMany()
                .HasForeignKey(s => s.TestScoreId)
                .OnDelete(DeleteBehavior.NoAction);
        });
        modelBuilder.Entity<Lesson>(entity =>
        {
            entity.HasOne(l => l.User)
                .WithMany();
            entity.HasOne(l => l.Course)
                .WithMany(c => c.Lessons)
                .OnDelete(DeleteBehavior.NoAction);
        });

        modelBuilder.Entity<Test>(entity =>
        {
            entity.HasOne(t => t.User)
                .WithMany();
            entity.HasOne(t => t.Lesson)
                .WithMany(l => l.Tests)
                .OnDelete(DeleteBehavior.NoAction);
        });

        modelBuilder.Entity<Question>(entity =>
        {
            entity.HasOne(q => q.User)
                .WithMany();
            entity.HasOne(q => q.Test)
                .WithMany(t => t.Questions)
                .OnDelete(DeleteBehavior.NoAction);
        });

        modelBuilder.Entity<Answer>(entity =>
        {
            entity.HasOne(a => a.User)
                .WithMany();
            entity.HasOne(a => a.Question)
                .WithMany(q => q.Answers)
                .OnDelete(DeleteBehavior.NoAction);
        });
    }
}
