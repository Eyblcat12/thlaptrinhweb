using Nova.Api.Models;

namespace Nova.Api.Contracts;

public record ProductResponse(string Id, string Name, string Category, string Brand, string Subtitle,
    long Price, long OriginalPrice, double Rating, int Reviews, string Color, string Art,
    string Background, string Badge, Dictionary<string, string> Specs)
{
    public static ProductResponse From(Product p) => new(p.Id, p.Name, p.CategoryId, p.Brand,
        p.Subtitle, p.Price, p.OriginalPrice, p.Rating, p.Reviews, p.Color, p.Art, p.Background, p.Badge, p.Specs);
}

public record CategoryResponse(string Id, string Name, string Icon, int SortOrder)
{
    public static CategoryResponse From(Category c) => new(c.Id, c.Name, c.Icon, c.SortOrder);
}
