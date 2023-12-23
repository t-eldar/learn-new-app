using LearnNew.Models.Entities;
using LearnNew.Models.Requests;

namespace LearnNew.Services.Interfaces;
public interface ITestService
{
    Task<TestScore> CheckTestAsync(CheckTestRequest request);
}
