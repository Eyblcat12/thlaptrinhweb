using System.Text.Json;
using Microsoft.EntityFrameworkCore;
using Nova.Api.Contracts;
using Nova.Api.Models;

namespace Nova.Api.Data;

public static class SeedData
{
    public static async Task InitializeAsync(NovaDbContext db, string contentRoot)
    {
        // Chỉ seed khi khởi tạo DB lần đầu. Xóa dữ liệu bằng CRUD không khiến dữ liệu cũ tự xuất hiện lại.
        if (await db.SeedStates.AnyAsync(s => s.Id == 1)) return;
        var options = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };
        var categories = JsonSerializer.Deserialize<List<CategoryRequest>>(
            await File.ReadAllTextAsync(Path.Combine(contentRoot, "Data", "Seed", "categories.json")), options)!;
        var products = JsonSerializer.Deserialize<List<ProductRequest>>(
            await File.ReadAllTextAsync(Path.Combine(contentRoot, "Data", "Seed", "products.json")), options)!;
        await using var transaction = await db.Database.BeginTransactionAsync();
        db.SeedStates.Add(new SeedState { Id = 1 });
        db.Categories.AddRange(categories.Select(c => new Category { Id = c.Id, Name = c.Name, Icon = c.Icon, SortOrder = c.SortOrder }));
        db.Products.AddRange(products.Select((p, index) => new Product {
            Id = p.Id, Name = p.Name, CategoryId = p.Category, Brand = p.Brand, Subtitle = p.Subtitle,
            Price = p.Price, OriginalPrice = p.OriginalPrice, Rating = p.Rating, Reviews = p.Reviews,
            Color = p.Color, Art = p.Art, Background = p.Background, Badge = p.Badge, Specs = p.Specs, SortOrder = index
        }));
        await db.SaveChangesAsync();
        await transaction.CommitAsync();
    }
}
