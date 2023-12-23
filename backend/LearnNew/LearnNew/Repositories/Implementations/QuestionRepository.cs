using Azure.Core;
using System;

using LearnNew.DatabaseContext;
using LearnNew.Models.Entities;
using LearnNew.Models.Requests.Create;
using LearnNew.Models.Requests.Update;
using LearnNew.Repositories.Interfaces;

using Microsoft.EntityFrameworkCore;

namespace LearnNew.Repositories.Implementations;
public class QuestionRepository : IQuestionRepository
{
    private readonly IApplicationContext _applicationContext;

    public QuestionRepository(IApplicationContext applicationContext) => _applicationContext = applicationContext;
    public async Task<Question?> GetByIdAsync(int id) => await _applicationContext
        .Questions
        .Include(q => q.Answers)
        .FirstOrDefaultAsync(q => q.Id == id);
    public async Task<IEnumerable<Question>?> GetByTestIdAsync(int testId) => await _applicationContext
        .Questions
        .Include(q => q.Answers)
        .Where(q => q.TestId == testId)
        .ToArrayAsync();

    public async Task<Question> CreateAsync(CreateEmptyQuestionRequest request)
    {
        ArgumentNullException.ThrowIfNull(request);

        var question = new Question
        {
            Content = request.Content,
            TestId = request.TestId,
            AreAnswersChoicable = request.AreAnswersChoicable,
            UserId = request.UserId,
        };

        await _applicationContext.Questions.AddAsync(question);
        await _applicationContext.SaveChangesAsync();

        return question;
    }
    public async Task DeleteAsync(int id)
    {
        var question = await _applicationContext.Questions.FirstOrDefaultAsync(q => q.Id == id);
        if (question is null)
        {
            return;
        }

        _applicationContext.Questions.Remove(question);
        await _applicationContext.SaveChangesAsync();
    }
    public async Task UpdateAsync(UpdateQuestionRequest request)
    {
        ArgumentNullException.ThrowIfNull(request);

        var question = await _applicationContext.Questions.FirstOrDefaultAsync(q => q.Id == request.Id)
            ?? throw new Exception($"Cannot find request with id == {request.Id}");

        question.TestId = request.TestId ?? question.TestId;
        question.Content = request.Content ?? question.Content;
        question.AreAnswersChoicable = request.AreAnswersChoicable ?? question.AreAnswersChoicable;

        await _applicationContext.SaveChangesAsync();
    }

    public async Task<Question> CreateAsync(Question question)
    {
        ArgumentNullException.ThrowIfNull(question);

        await _applicationContext.Questions.AddAsync(question);
        await _applicationContext.SaveChangesAsync();

        return question;
    }
}
