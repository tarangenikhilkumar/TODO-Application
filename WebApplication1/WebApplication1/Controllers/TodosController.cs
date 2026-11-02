using Microsoft.AspNetCore.Mvc;
using WebApplication1.DTOs;
using WebApplication1.Models;
using WebApplication1.Services;

namespace WebApplication1.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TodosController : ControllerBase
{
    private readonly ITodoService _service;

    public TodosController(ITodoService service) => _service = service;

    [HttpGet]
    public async Task<ActionResult<List<TodoResponseDto>>> GetAll(
        [FromQuery] string? search,
        [FromQuery] string? category,
        [FromQuery] string? priority)
    {
        Category? parsedCategory = null;
        Priority? parsedPriority = null;

        if (!string.IsNullOrWhiteSpace(category))
        {
            if (!Enum.TryParse<Category>(category, true, out var c))
                return BadRequest(new { message = $"Invalid category '{category}'. Use Work or Personal." });
            parsedCategory = c;
        }

        if (!string.IsNullOrWhiteSpace(priority))
        {
            if (!Enum.TryParse<Priority>(priority, true, out var p))
                return BadRequest(new { message = $"Invalid priority '{priority}'. Use High, Medium or Low." });
            parsedPriority = p;
        }

        return Ok(await _service.GetAllAsync(search, parsedCategory, parsedPriority));
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<TodoResponseDto>> GetById(int id)
    {
        var todo = await _service.GetByIdAsync(id);
        return todo is null
            ? NotFound(new { message = $"Todo with id {id} was not found." })
            : Ok(todo);
    }

    [HttpPost]
    public async Task<ActionResult<TodoResponseDto>> Create(CreateTodoDto dto)
    {
        var created = await _service.CreateAsync(dto);
        return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
    }

    [HttpPut("{id:int}")]
    public async Task<ActionResult<TodoResponseDto>> Update(int id, UpdateTodoDto dto)
    {
        var updated = await _service.UpdateAsync(id, dto);
        return updated is null
            ? NotFound(new { message = $"Todo with id {id} was not found." })
            : Ok(updated);
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var deleted = await _service.DeleteAsync(id);
        return deleted
            ? NoContent()
            : NotFound(new { message = $"Todo with id {id} was not found." });
    }
}