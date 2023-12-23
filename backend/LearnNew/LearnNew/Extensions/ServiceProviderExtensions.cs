using LearnNew.Repositories.Implementations;
using LearnNew.Repositories.Interfaces;

namespace LearnNew.WebApi.Extensions;

public static class ServiceProviderExtensions
{
    public static IServiceCollection AddRepositories(this IServiceCollection services)
    {
        //services.AddTransient<IUserRepository, UserRepository>();
        services.AddTransient<IAnswerRepository, AnswerRepository>();
        services.AddTransient<IQuestionRepository, QuestionRepository>();
        services.AddTransient<ILessonRepository, LessonRepository>();
        services.AddTransient<ITestRepository, TestRepository>();
        services.AddTransient<ICourseRepository, CourseRepository>();
        services.AddTransient<IQuestionScoreRepository, QuestionScoreRepository>();
        services.AddTransient<ITestScoreRepository, TestScoreRepository>();

        return services;
    }
}
