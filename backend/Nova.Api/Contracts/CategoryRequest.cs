using System.ComponentModel.DataAnnotations;

namespace Nova.Api.Contracts;

public class CategoryRequest
{
    [Required, StringLength(80), RegularExpression("^[a-z0-9]+(?:-[a-z0-9]+)*$")]
    public string Id { get; set; } = "";
    [Required, StringLength(100, MinimumLength = 2)]
    public string Name { get; set; } = "";
    [Required, RegularExpression("^(grid|phone|laptop|headphones|watch|mouse)$")]
    public string Icon { get; set; } = "grid";
    [Range(0, 1000)]
    public int SortOrder { get; set; }
}
