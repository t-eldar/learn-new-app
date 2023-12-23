using Azure.Core;

using LearnNew.DatabaseContext;
using LearnNew.Models.Entities;
using LearnNew.Models.Requests;
using LearnNew.Models.Requests.Create;
using LearnNew.Models.Requests.Update;
using LearnNew.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace LearnNew.Repositories.Implementations;
public class AnswerRepository : IAnswerRepository
{
    private readonly IApplicationContext _applicationContext;
    public AnswerRepository(IApplicationContext applicationContext) => _applicationContext = applicationContext;

    public async Task<Answer?> GetCorrectByQuestionIdAsync(int questionId)
    {
        var question = await _applicationContext.Questions.FirstOrDefaultAsync(q => q.Id == questionId);
        if (question is null)
        {
            return null;
        }

        var answers = await GetAllByQuestionIdAsync(questionId);
        var correct = answers?.SingleOrDefault(a => a.IsCorrect);

        return correct;
    }
    public async Task<IEnumerable<Answer>?> GetAllByQuestionIdAsync(int questionId) => await _applicationContext
        .Answers
        .Where(a => a.QuestionId == questionId)
        .ToArrayAsync();
    public async Task<Answer?> GetByIdAsync(int id) => await _applicationContext
        .Answers
        .Include(a => a.Question!)
        .FirstOrDefaultAsync(a => a.Id == id);
    public async Task<Answer> CreateAsync(CreateAnswerRequest request)
    {
        ArgumentNullException.ThrowIfNull(request);
        var answer = new Answer
        {
            Text = request.Text,
            QuestionId = request.QuestionId,
            UserId = request.UserId,
            IsCorrect = request.IsCorrect,
        };
        await _applicationContext.Answers.AddAsync(answer);
        await _applicationContext.SaveChangesAsync();

        return answer;
    }
    public async Task DeleteAsync(int id)
    {
        var answer = await _applicationContext.Answers.FirstOrDefaultAsync(a => a.Id == id);
        if (answer is null)
        {
            return;
        }

        _applicationContext.Answers.Remove(answer);
        await _applicationContext.SaveChangesAsync();
    }
    public async Task UpdateAsync(UpdateAnswerRequest request)
    {
        ArgumentNullException.ThrowIfNull(request);

        var answer = await _applicationContext.Answers.FirstOrDefaultAsync(a => a.Id == request.Id)
            ?? throw new Exception($"Cannot find request with id == {request.Id}");

        answer.QuestionId = request.QuestionId ?? answer.QuestionId;
        answer.Text = request.Text ?? answer.Text;
        answer.IsCorrect = request.IsCorrect ?? answer.IsCorrect;

        await _applicationContext.SaveChangesAsync();
    }

    public async Task<IEnumerable<Answer>?> GetAllByTestIdAsync(int testId) => await _applicationContext
        .Answers
        .Include(a => a.Question!)
        .Where(a => a.Question!.TestId == testId)
        .ToArrayAsync();
    public async Task<IEnumerable<Answer>?> GetCorrectByTestIdAsync(int testId) => await _applicationContext
        .Answers
        .Include(a => a.Question!)
        .Where(a => a.Question!.TestId == testId && a.IsCorrect)
        .ToArrayAsync();
    public async Task<Answer> CreateAsync(Answer answer) 
    {
        ArgumentNullException.ThrowIfNull(answer);

        await _applicationContext.Answers.AddAsync(answer);
        await _applicationContext.SaveChangesAsync();

        return answer;
    }
}
