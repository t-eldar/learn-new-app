namespace LearnNew.Models.Requests.Authentication;
public record SignInRequest
{
    public required string Email { get; set; }  
    public required string Password { get; set; }
    public required bool RememberMe { get; set; }
}