using System.Text.Json;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using Nova.Api.Models;

namespace Nova.Api.Data;

public class NovaDbContext(DbContextOptions<NovaDbContext> options) : DbContext(options)
{
    public DbSet<Product> Products => Set<Product>();
    public DbSet<Category> Categories => Set<Category>();
    public DbSet<SeedState> SeedStates => Set<SeedState>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        var category = modelBuilder.Entity<Category>();
        category.HasKey(c => c.Id);
        category.Property(c => c.Id).HasMaxLength(80);
        category.Property(c => c.Name).HasMaxLength(100).IsRequired();
        category.Property(c => c.Icon).HasMaxLength(30).IsRequired();

        var product = modelBuilder.Entity<Product>();
        product.HasKey(p => p.Id);
        product.Property(p => p.Id).HasMaxLength(80);
        product.Property(p => p.Name).HasMaxLength(160).IsRequired();
        product.Property(p => p.Brand).HasMaxLength(80).IsRequired();
        product.Property(p => p.Subtitle).HasMaxLength(300);
        product.Property(p => p.Color).HasMaxLength(80);
        product.Property(p => p.Art).HasMaxLength(30);
        product.Property(p => p.Background).HasMaxLength(7);
        product.Property(p => p.Badge).HasMaxLength(40);
        product.HasOne(p => p.Category).WithMany(c => c.Products)
            .HasForeignKey(p => p.CategoryId).OnDelete(DeleteBehavior.Restrict);
        product.HasIndex(p => p.Brand);
        // Dictionary được chuyển thành JSON TEXT; comparer giúp EF phát hiện chỉnh sửa.
        product.Property(p => p.Specs)
            .HasConversion(
                value => JsonSerializer.Serialize(value, (JsonSerializerOptions?)null),
                value => JsonSerializer.Deserialize<Dictionary<string, string>>(value, (JsonSerializerOptions?)null) ?? new())
            .Metadata.SetValueComparer(new ValueComparer<Dictionary<string, string>>(
                (a, b) => JsonSerializer.Serialize(a, (JsonSerializerOptions?)null) == JsonSerializer.Serialize(b, (JsonSerializerOptions?)null),
                value => JsonSerializer.Serialize(value, (JsonSerializerOptions?)null).GetHashCode(),
                value => new Dictionary<string, string>(value)));
    }
}
