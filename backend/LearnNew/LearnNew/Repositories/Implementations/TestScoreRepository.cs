using Azure.Core;

using LearnNew.DatabaseContext;
using LearnNew.Models.Entities;
using LearnNew.Models.Requests.Create;
using LearnNew.Models.Requests.Update;
using LearnNew.Repositories.Interfaces;
using LearnNew.Services.Interfaces;

using Microsoft.EntityFrameworkCore;

namespace LearnNew.Repositories.Implementations;

public class TestScoreRepository : ITestScoreRepository
{
    private readonly IApplicationContext _applicationContext;
    private readonly IDateTimeProvider _dateTimeProvider;

    public TestScoreRepository(
        IApplicationContext applicationContext,
        IDateTimeProvider dateTimeProvider
    )
    {
        _applicationContext = applicationContext;
        _dateTimeProvider = dateTimeProvider;
    }

    public async Task<IEnumerable<TestScore>?> GetAllAsync() =>
        await _applicationContext.TestScores.Include(s => s.QuestionScores).ToArrayAsync();

    public async Task<TestScore?> GetByIdAsync(int id) =>
        await _applicationContext.TestScores
            .Include(s => s.QuestionScores)
            .FirstOrDefaultAsync(s => s.Id == id);

    public async Task<TestScore?> GetByUserAndTestIdAsync(string userId, int testId) =>
        await _applicationContext.TestScores
            .Include(s => s.QuestionScores)
            .FirstOrDefaultAsync(s => s.UserId == userId && s.TestId == testId);

    public async Task<TestScore> CreateAsync(CreateTestScoreRequest request)
    {
        ArgumentNullException.ThrowIfNull(request);

        var score = await GetByUserAndTestIdAsync(request.UserId, request.TestId);

        if (score is not null)
        {
            throw new Exception("TestScore already exist");
        }

        var newScore = new TestScore
        {
            UserId = request.UserId,
            TestId = request.TestId,
            Score = request.Score,
            TestingDate = _dateTimeProvider.GetCurrentUtc(),
        };

        await _applicationContext.TestScores.AddAsync(newScore);
        await _applicationContext.SaveChangesAsync();

        return newScore;
    }

    public async Task UpdateAsync(UpdateTestScoreRequest request)
    {
        ArgumentNullException.ThrowIfNull(request);

        var score = await _applicationContext.TestScores
            .FirstOrDefaultAsync(s => s.Id == request.Id)
            ?? throw new Exception("Test score is not exist");

        score.TestingDate = _dateTimeProvider.GetCurrentUtc();
        score.Score = request.Score;

        await _applicationContext.SaveChangesAsync();
    }

    public async Task DeleteAsync(int id)
    {
        var testScore = await _applicationContext.TestScores.FirstOrDefaultAsync(t => t.Id == id);
        if (testScore is null)
        {
            return;
        }

        _applicationContext.TestScores.Remove(testScore);
        await _applicationContext.SaveChangesAsync();
    }

    public async Task<TestScore> CreateAsync(TestScore testScore)
    {
        ArgumentNullException.ThrowIfNull(testScore);

        await _applicationContext.TestScores.AddAsync(testScore);
        await _applicationContext.SaveChangesAsync();

        return testScore;
    }
}
