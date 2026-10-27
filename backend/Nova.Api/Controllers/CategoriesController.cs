using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Nova.Api.Contracts;
using Nova.Api.Data;
using Nova.Api.Models;

namespace Nova.Api.Controllers;

[ApiController]
[Route("api/categories")]
public class CategoriesController(NovaDbContext db) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<IEnumerable<CategoryResponse>>> GetAll(CancellationToken ct) =>
        Ok((await db.Categories.AsNoTracking().OrderBy(c => c.SortOrder).ThenBy(c => c.Id).ToListAsync(ct)).Select(CategoryResponse.From));

    [HttpGet("{id}")]
    public async Task<ActionResult<CategoryResponse>> GetById(string id, CancellationToken ct)
    {
        var category = await db.Categories.AsNoTracking().FirstOrDefaultAsync(c => c.Id == id, ct);
        return category is null ? NotFound() : Ok(CategoryResponse.From(category));
    }

    [HttpPost]
    public async Task<ActionResult<CategoryResponse>> Create(CategoryRequest request, CancellationToken ct)
    {
        if (request.Id == "all" || await db.Categories.AnyAsync(c => c.Id == request.Id, ct))
            return Problem(statusCode: 409, title: "Mã danh mục đã tồn tại hoặc được dành riêng.");
        var category = new Category { Id = request.Id, Name = request.Name.Trim(), Icon = request.Icon, SortOrder = request.SortOrder };
        db.Categories.Add(category);
        try { await db.SaveChangesAsync(ct); }
        catch (DbUpdateException) { return Problem(statusCode: 409, title: "Mã danh mục đã tồn tại."); }
        return CreatedAtAction(nameof(GetById), new { id = category.Id }, CategoryResponse.From(category));
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(string id, CategoryRequest request, CancellationToken ct)
    {
        if (id != request.Id) return Problem(statusCode: 400, title: "Mã trong URL phải khớp mã danh mục.");
        var category = await db.Categories.FindAsync([id], ct);
        if (category is null) return NotFound();
        category.Name = request.Name.Trim(); category.Icon = request.Icon; category.SortOrder = request.SortOrder;
        try { await db.SaveChangesAsync(ct); }
        catch (DbUpdateConcurrencyException) { return NotFound(); }
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(string id, CancellationToken ct)
    {
        var category = await db.Categories.FindAsync([id], ct);
        if (category is null) return NotFound();
        if (await db.Products.AnyAsync(p => p.CategoryId == id, ct))
            return Problem(statusCode: 409, title: "Chuyển hoặc xóa các sản phẩm trong danh mục trước khi xóa danh mục.");
        db.Categories.Remove(category);
        try { await db.SaveChangesAsync(ct); }
        catch (DbUpdateConcurrencyException) { return NotFound(); }
        catch (DbUpdateException) { return Problem(statusCode: 409, title: "Danh mục đang được sử dụng."); }
        return NoContent();
    }
}
