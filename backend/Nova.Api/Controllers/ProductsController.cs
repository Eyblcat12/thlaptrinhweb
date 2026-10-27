using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Nova.Api.Contracts;
using Nova.Api.Data;
using Nova.Api.Models;

namespace Nova.Api.Controllers;

[ApiController]
[Route("api/products")]
public class ProductsController(NovaDbContext db) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<IEnumerable<ProductResponse>>> GetAll(CancellationToken ct)
    {
        var products = await db.Products.AsNoTracking().OrderBy(p => p.SortOrder).ThenBy(p => p.Id).ToListAsync(ct);
        return Ok(products.Select(ProductResponse.From));
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<ProductResponse>> GetById(string id, CancellationToken ct)
    {
        var product = await db.Products.AsNoTracking().FirstOrDefaultAsync(p => p.Id == id, ct);
        return product is null ? NotFound() : Ok(ProductResponse.From(product));
    }

    [HttpPost]
    public async Task<ActionResult<ProductResponse>> Create(ProductRequest request, CancellationToken ct)
    {
        if (await db.Products.AnyAsync(p => p.Id == request.Id, ct))
            return Problem(statusCode: 409, title: "Mã sản phẩm đã tồn tại.");
        if (!await db.Categories.AnyAsync(c => c.Id == request.Category, ct))
            return Problem(statusCode: 400, title: "Danh mục không tồn tại.");

        var product = new Product { Id = request.Id, SortOrder = (await db.Products.MaxAsync(p => (int?)p.SortOrder, ct) ?? 0) + 1 };
        Apply(request, product);
        db.Products.Add(product);
        try { await db.SaveChangesAsync(ct); }
        catch (DbUpdateException) { return Problem(statusCode: 409, title: "Dữ liệu đã thay đổi. Vui lòng tải lại danh mục và mã sản phẩm."); }
        return CreatedAtAction(nameof(GetById), new { id = product.Id }, ProductResponse.From(product));
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(string id, ProductRequest request, CancellationToken ct)
    {
        if (id != request.Id) return Problem(statusCode: 400, title: "Mã trong URL phải khớp mã sản phẩm.");
        var product = await db.Products.FindAsync([id], ct);
        if (product is null) return NotFound();
        if (!await db.Categories.AnyAsync(c => c.Id == request.Category, ct))
            return Problem(statusCode: 400, title: "Danh mục không tồn tại.");
        Apply(request, product);
        try { await db.SaveChangesAsync(ct); }
        catch (DbUpdateConcurrencyException) { return NotFound(); }
        catch (DbUpdateException) { return Problem(statusCode: 409, title: "Danh mục đã thay đổi. Vui lòng tải lại."); }
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(string id, CancellationToken ct)
    {
        var product = await db.Products.FindAsync([id], ct);
        if (product is null) return NotFound();
        db.Products.Remove(product);
        try { await db.SaveChangesAsync(ct); }
        catch (DbUpdateConcurrencyException) { return NotFound(); }
        return NoContent();
    }

    private static void Apply(ProductRequest r, Product p)
    {
        p.Name = r.Name.Trim(); p.CategoryId = r.Category; p.Brand = r.Brand.Trim();
        p.Subtitle = r.Subtitle?.Trim() ?? ""; p.Price = r.Price; p.OriginalPrice = r.OriginalPrice;
        p.Rating = r.Rating; p.Reviews = r.Reviews; p.Color = r.Color?.Trim() ?? "";
        p.Art = r.Art; p.Background = r.Background; p.Badge = r.Badge?.Trim() ?? ""; p.Specs = r.Specs;
    }
}
