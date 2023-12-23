namespace LearnNew.Models.Requests.Create;

public interface ICreateTestRequest
{
    string Title { get; set; }
    int LessonId { get; set; }
    string UserId { get; set; }
}
