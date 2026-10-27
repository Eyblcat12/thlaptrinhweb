using System.ComponentModel.DataAnnotations;

namespace Nova.Api.Contracts;

// DTO riêng: không nhận Category navigation hoặc entity từ client (tránh overposting).
public class ProductRequest : IValidatableObject
{
    [Required, StringLength(80), RegularExpression("^[a-z0-9]+(?:-[a-z0-9]+)*$")]
    public string Id { get; set; } = "";
    [Required, StringLength(160, MinimumLength = 2)]
    public string Name { get; set; } = "";
    [Required, StringLength(80)]
    public string Category { get; set; } = "";
    [Required, StringLength(80)]
    public string Brand { get; set; } = "";
    [StringLength(300)]
    public string Subtitle { get; set; } = "";
    [Range(1, 1_000_000_000)]
    public long Price { get; set; }
    [Range(1, 1_000_000_000)]
    public long OriginalPrice { get; set; }
    [Range(0, 5)]
    public double Rating { get; set; }
    [Range(0, 1_000_000)]
    public int Reviews { get; set; }
    [StringLength(80)]
    public string Color { get; set; } = "";
    [Required, RegularExpression("^(headphones|phone|laptop|watch|earbuds|mouse)$")]
    public string Art { get; set; } = "headphones";
    [Required, RegularExpression("^#[0-9a-fA-F]{6}$")]
    public string Background { get; set; } = "#efeee9";
    [StringLength(40)]
    public string Badge { get; set; } = "";
    [Required]
    public Dictionary<string, string> Specs { get; set; } = new();

    public IEnumerable<ValidationResult> Validate(ValidationContext validationContext)
    {
        if (OriginalPrice < Price)
            yield return new ValidationResult("Giá gốc phải lớn hơn hoặc bằng giá bán.", [nameof(OriginalPrice)]);
        if (Specs is not null && (Specs.Count > 20 || Specs.Any(s => string.IsNullOrWhiteSpace(s.Key) || s.Key.Length > 80 || string.IsNullOrWhiteSpace(s.Value) || s.Value.Length > 300)))
            yield return new ValidationResult("Tối đa 20 thông số; tên 1–80 ký tự, giá trị 1–300 ký tự.", [nameof(Specs)]);
    }
}
