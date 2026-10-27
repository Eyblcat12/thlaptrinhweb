namespace Nova.Api.Models;

public class Category
{
    public string Id { get; set; } = "";
    public string Name { get; set; } = "";
    public string Icon { get; set; } = "grid";
    public int SortOrder { get; set; }
    public ICollection<Product> Products { get; set; } = new List<Product>();
}
