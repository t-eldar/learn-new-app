using LearnNew.Services.Interfaces;

namespace LearnNew.Services.Implementations;
public class DateTimeProvider : IDateTimeProvider
{
    public DateTime GetCurrent() => DateTime.Now;
    public DateTime GetCurrentUtc() => DateTime.UtcNow;
    public DateOnly GetCurrentDateOnly() => DateOnly.FromDateTime(GetCurrent());
    public DateOnly GetCurrentDateOnlyUtc() => DateOnly.FromDateTime(GetCurrentUtc());
    public TimeOnly GetCurrentTimeOnly() => TimeOnly.FromDateTime(GetCurrent());
    public TimeOnly GetCurrentTimeOnlyUtc() => TimeOnly.FromDateTime(GetCurrentUtc());
}
