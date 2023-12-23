using LearnNew.Models.Entities;
using LearnNew.Models.Requests;
using LearnNew.Models.Requests.Create;
using LearnNew.Models.Requests.Update;
using LearnNew.Models.Requests.Utils;
using LearnNew.Repositories.Interfaces;
using LearnNew.Services.Interfaces;

namespace LearnNew.Services.Implementations;

public class TestService : ITestService
{
    private readonly IQuestionRepository _questionRepository;
    private readonly IAnswerRepository _answerRepository;
    private readonly IQuestionScoreRepository _questionScoreRepository;
    private readonly ITestScoreRepository _testScoreRepository;

    public TestService(
        IQuestionRepository questionRepository,
        ITestScoreRepository testScoreRepository,
        IQuestionScoreRepository questionScoreRepository,
        IAnswerRepository answerRepository
    )
    {
        _questionRepository = questionRepository;
        _testScoreRepository = testScoreRepository;
        _questionScoreRepository = questionScoreRepository;
        _answerRepository = answerRepository;
    }

    public async Task<TestScore> CheckTestAsync(CheckTestRequest request)
    {
        var userAnswers = request.AnswerRequests;
        var testId = request.TestId;

        var singleAnswer = userAnswers.First();
        var wrongUserIdAnswers = userAnswers
            .Where(a => a.UserId != singleAnswer.UserId)
            .ToArray();

        var userId = singleAnswer.UserId;

        if (wrongUserIdAnswers.Length > 0)
        {
            throw new Exception("User answers should have same user id");
        }

        var questions = await _questionRepository.GetByTestIdAsync(testId)
            ?? throw new Exception($"No questions for test id = {testId}");

        var testScore = await _testScoreRepository.CreateAsync(
            new CreateTestScoreRequest
            {
                Score = 0,
                UserId = userId,
                TestId = testId,
            }
        );

        var score = 0;
        var correctAnswers = await _answerRepository.GetCorrectByTestIdAsync(testId)
            ?? throw new Exception($"No correct answers fot test id = {testId}");
        foreach (var question in questions)
        {
            var userAnswer = userAnswers.FirstOrDefault(a => a.QuestionId == question.Id);
            var correct = correctAnswers.FirstOrDefault(a => a.QuestionId == question.Id)
                ?? throw new Exception($"No correct answers for {question.Id}");
            var createQuestionScoreRequest = GetCreateQuestionScoreRequest(
                userAnswer,
                correct,
                question,
                testScore.Id,
                userId
            );

            if (createQuestionScoreRequest.IsCorrect)
            {
                score++;
            }
            await _questionScoreRepository.CreateAsync(createQuestionScoreRequest);
        }

        var updateRequest = new UpdateTestScoreRequest { Id = testScore.Id, Score = score, };
        await _testScoreRepository.UpdateAsync(updateRequest);

        return await _testScoreRepository.GetByIdAsync(testScore.Id)
            ?? throw new Exception("Cannot get test score");
    }

    private CreateQuestionScoreRequest GetCreateQuestionScoreRequest(
        CheckTestRequestAnswer userAnswer,
        Answer correctAnswer,
        Question question,
        int testScoreId,
        string userId
    )
    {
        if (userAnswer is null)
        {
            return new()
            {
                TestScoreId = testScoreId,
                UserId = userId,
                QuestionId = question.Id,
                IsCorrect = false,
                UserAnswerText = "",
            };
        }

        var isCorrect = false;
        var answerText = userAnswer.AnswerText;

        if (userAnswer.AnswerText.ToLower().Trim() == correctAnswer.Text.ToLower().Trim())
        {
            isCorrect = true;
        }

        return new()
        {
            TestScoreId = testScoreId,
            UserId = userId,
            QuestionId = question.Id,
            IsCorrect = isCorrect,
            UserAnswerText = answerText,
        };
    }
}
