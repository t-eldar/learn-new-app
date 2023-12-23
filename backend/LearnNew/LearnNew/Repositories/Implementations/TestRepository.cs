using Azure.Core;

using LearnNew.DatabaseContext;
using LearnNew.Models.Entities;
using LearnNew.Models.Requests.Create;
using LearnNew.Models.Requests.Update;
using LearnNew.Repositories.Interfaces;

using Microsoft.EntityFrameworkCore;

namespace LearnNew.Repositories.Implementations;

public class TestRepository : ITestRepository
{
    private readonly IApplicationContext _applicationContext;
    private readonly IAnswerRepository _answerRepository;
    private readonly IQuestionRepository _questionRepository;

    public TestRepository(
        IApplicationContext applicationContext,
        IQuestionRepository questionRepository,
        IAnswerRepository answerRepository
    )
    {
        _applicationContext = applicationContext;
        _questionRepository = questionRepository;
        _answerRepository = answerRepository;
    }

    public async Task<IEnumerable<Test>?> GetAllAsync() =>
        await _applicationContext.Tests.ToArrayAsync();

    public async Task<IEnumerable<Test>?> GetByLessonIdAsync(int lessonId) =>
        await _applicationContext.Tests
            .Include(t => t.Questions!)
            .ThenInclude(q => q.Answers)
            .Where(t => t.LessonId == lessonId)
            .ToArrayAsync();

    public async Task<Test?> GetByIdAsync(int id) =>
        await _applicationContext.Tests
            .Include(t => t.Questions!)
            .ThenInclude(q => q.Answers)
            .FirstOrDefaultAsync(t => t.Id == id);

    public async Task<Test> CreateAsync(CreateEmptyTestRequest request)
    {
        ArgumentNullException.ThrowIfNull(request);

        var test = new Test
        {
            Title = request.Title,
            LessonId = request.LessonId,
            UserId = request.UserId,
        };

        await _applicationContext.Tests.AddAsync(test);
        await _applicationContext.SaveChangesAsync();

        return test;
    }

    public async Task DeleteAsync(int id)
    {
        var test = await _applicationContext.Tests.FirstOrDefaultAsync(t => t.Id == id);
        if (test is null)
        {
            return;
        }

        _applicationContext.Tests.Remove(test);
        await _applicationContext.SaveChangesAsync();
    }

    public async Task UpdateAsync(UpdateTestRequest request)
    {
        ArgumentNullException.ThrowIfNull(request);

        var test =
            await _applicationContext.Tests.FirstOrDefaultAsync(t => t.Id == request.Id)
            ?? throw new Exception($"Cannot find request with id == {request.Id}");

        test.Title = request.Title ?? test.Title;
        test.LessonId = request.LessonId ?? test.LessonId;

        await _applicationContext.SaveChangesAsync();
    }

    public async Task<Test> CreateAsync(CreateFullTestRequest request)
    {
        ArgumentNullException.ThrowIfNull(request);

        foreach (var item in request.Questions)
        {
            if (
                !item.Answers.Any(a => a.IsCorrect)
                || item.Answers.Where(a => a.IsCorrect).Count() > 1
            )
            {
                throw new Exception("Question should have only one correct answer");
            }
        }

        var test = await CreateAsync(
            new Test
            {
                LessonId = request.LessonId,
                UserId = request.UserId,
                Title = request.Title,
            }
        );

        foreach (var item in request.Questions)
        {
            var question = await _questionRepository.CreateAsync(
                new CreateEmptyQuestionRequest
                {
                    AreAnswersChoicable = item.AreAnswersChoicable,
                    Content = item.Content,
                    TestId = test.Id,
                    UserId = test.UserId
                }
            );

            foreach (var requestAnswer in item.Answers)
            {
                var answer = await _answerRepository.CreateAsync(
                    new CreateAnswerRequest
                    {
                        Text = requestAnswer.Text,
                        IsCorrect = requestAnswer.IsCorrect,
                        UserId = test.UserId,
                        QuestionId = question.Id,
                    }
                );
            }
        }

        return test;
    }

    public async Task<Test> CreateAsync(Test test)
    {
        ArgumentNullException.ThrowIfNull(test);

        await _applicationContext.Tests.AddAsync(test);
        await _applicationContext.SaveChangesAsync();

        return test;
    }
}
