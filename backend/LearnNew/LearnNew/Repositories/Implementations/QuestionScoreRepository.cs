using LearnNew.DatabaseContext;
using LearnNew.Models.Entities;
using LearnNew.Models.Requests.Create;
using LearnNew.Models.Requests.Update;
using LearnNew.Repositories.Interfaces;

using Microsoft.EntityFrameworkCore;

namespace LearnNew.Repositories.Implementations;
public class QuestionScoreRepository : IQuestionScoreRepository
{
    private readonly IApplicationContext _applicationContext;

    public QuestionScoreRepository(IApplicationContext applicationContext) => _applicationContext = applicationContext;
    public async Task<IEnumerable<QuestionScore>?> GetAllAsync() => await _applicationContext
        .QuestionScores
        .Include(s => s.Question!)
        .Include(s => s.TestScore!)
        .ToArrayAsync();
    public async Task<QuestionScore?> GetByIdAsync(int id) => await _applicationContext
        .QuestionScores
        .Include(s => s.Question!)
        .Include(s => s.TestScore!)
        .FirstOrDefaultAsync(s => s.Id == id);
    public async Task<QuestionScore?> GetByUserAndQuestionIdAsync(string userId, int questionId) => await _applicationContext
        .QuestionScores
        .Include(s => s.Question!)
        .Include(s => s.TestScore!)
        .FirstOrDefaultAsync(s => s.UserId == userId && s.QuestionId == questionId);
    public async Task<IEnumerable<QuestionScore>?> GetByTestScoreIdAsync(int testScoreId) => await _applicationContext
        .QuestionScores
        .Include(s => s.Question!)
        .Include(s => s.TestScore!)
        .Where(s => s.TestScoreId == testScoreId)
        .ToArrayAsync();
    public async Task<QuestionScore> CreateAsync(CreateQuestionScoreRequest request)
    {
        ArgumentNullException.ThrowIfNull(request);

        var score = await GetByUserAndQuestionIdAsync(request.UserId, request.QuestionId);
        if (score is not null)
        {
            throw new Exception("QuestionScore already exist");
        }

        var newScore = new QuestionScore
        {
            IsCorrect = request.IsCorrect,
            UserAnswerText = request.UserAnswerText,
            TestScoreId = request.TestScoreId,
            UserId = request.UserId,
            QuestionId = request.QuestionId,
        };

        await _applicationContext.QuestionScores.AddAsync(newScore);
        await _applicationContext.SaveChangesAsync();

        return newScore;
    }
    public async Task DeleteAsync(int id)
    {
        var existed = await GetByIdAsync(id);
        if (existed is null)
        {
            return;
        }

        _applicationContext.QuestionScores.Remove(existed);
        await _applicationContext.SaveChangesAsync();
    }

    public async Task UpdateAsync(UpdateQuestionScoreRequest request)
    {
        ArgumentNullException.ThrowIfNull(request);

        var score = await _applicationContext.QuestionScores
            .FirstOrDefaultAsync(s => s.Id == request.Id)
            ?? throw new Exception("Test score is not exist");

        score.IsCorrect = request.IsCorrect ?? score.IsCorrect;
        score.UserAnswerText = request.UserAnswerText ?? score.UserAnswerText; 

        await _applicationContext.SaveChangesAsync();
    }

    public async Task<QuestionScore> CreateAsync(QuestionScore questionScore)
    {
        ArgumentNullException.ThrowIfNull(questionScore);

        await _applicationContext.QuestionScores.AddAsync(questionScore);
        await _applicationContext.SaveChangesAsync();

        return questionScore;
    }
}
