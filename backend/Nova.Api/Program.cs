using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;
using Nova.Api.Data;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddControllers();
builder.Services.AddOpenApi();
builder.Services.AddProblemDetails();

var connection = new SqliteConnectionStringBuilder(
    builder.Configuration.GetConnectionString("NovaDatabase")
    ?? throw new InvalidOperationException("Missing ConnectionStrings:NovaDatabase."));
// Đường dẫn DB luôn tính từ thư mục API, không thay đổi theo thư mục gọi dotnet run/EF.
if (connection.DataSource != ":memory:" && !Path.IsPathRooted(connection.DataSource))
    connection.DataSource = Path.GetFullPath(Path.Combine(builder.Environment.ContentRootPath, connection.DataSource));
if (connection.DataSource != ":memory:")
    Directory.CreateDirectory(Path.GetDirectoryName(connection.DataSource)!);
builder.Services.AddDbContext<NovaDbContext>(options => options.UseSqlite(connection.ConnectionString));

var origins = builder.Configuration.GetSection("Cors:AllowedOrigins").Get<string[]>() ?? [];
builder.Services.AddCors(options => options.AddPolicy("Frontend", policy =>
    policy.WithOrigins(origins).AllowAnyHeader().WithMethods("GET", "POST", "PUT", "DELETE")));

var app = builder.Build();
app.UseExceptionHandler();
app.UseStatusCodePages();
app.UseCors("Frontend");
app.MapControllers();
if (app.Environment.IsDevelopment()) app.MapOpenApi();
app.MapGet("/api/health", async (NovaDbContext db, CancellationToken ct) =>
    await db.Database.CanConnectAsync(ct)
        ? Results.Ok(new { status = "ok", database = "SQLite" })
        : Results.Problem(statusCode: 503, title: "Database unavailable."));

// Development: chạy migration đã commit. Production: dùng dotnet ef database update khi triển khai.
if (app.Configuration.GetValue<bool>("Database:ApplyMigrationsOnStartup"))
{
    await using var scope = app.Services.CreateAsyncScope();
    var db = scope.ServiceProvider.GetRequiredService<NovaDbContext>();
    await db.Database.MigrateAsync();
    await SeedData.InitializeAsync(db, app.Environment.ContentRootPath);
}
await app.RunAsync();

public partial class Program { }
