namespace Nova.Api.Models;

public class Product
{
    public string Id { get; set; } = "";
    public string Name { get; set; } = "";
    public string CategoryId { get; set; } = "";
    public Category Category { get; set; } = null!;
    public string Brand { get; set; } = "";
    public string Subtitle { get; set; } = "";
    // Tiền VND lưu số nguyên, tránh sai số làm tròn và giới hạn decimal của SQLite.
    public long Price { get; set; }
    public long OriginalPrice { get; set; }
    public double Rating { get; set; }
    public int Reviews { get; set; }
    public string Color { get; set; } = "";
    public string Art { get; set; } = "headphones";
    public string Background { get; set; } = "#efeee9";
    public string Badge { get; set; } = "";
    public Dictionary<string, string> Specs { get; set; } = new();
    public int SortOrder { get; set; }
}
