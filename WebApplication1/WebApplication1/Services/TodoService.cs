using Microsoft.EntityFrameworkCore;
using WebApplication1.Data;
using WebApplication1.DTOs;
using WebApplication1.Models;

namespace WebApplication1.Services;

public class TodoService : ITodoService
{
    private readonly AppDbContext _db;

    public TodoService(AppDbContext db) => _db = db;

    public async Task<List<TodoResponseDto>> GetAllAsync(
        string? search, Category? category, Priority? priority)
    {
        var query = _db.Todos.AsNoTracking().AsQueryable();

        if (!string.IsNullOrWhiteSpace(search))
        {
            var term = search.Trim().ToLower();
            query = query.Where(t =>
                t.Title.ToLower().Contains(term) ||
                (t.Description != null && t.Description.ToLower().Contains(term)));
        }

        if (category.HasValue) query = query.Where(t => t.Category == category.Value);
        if (priority.HasValue) query = query.Where(t => t.Priority == priority.Value);

        var todos = await query
            .OrderBy(t => t.IsCompleted)
            .ThenByDescending(t => t.CreatedAt)
            .ToListAsync();

        return todos.Select(TodoResponseDto.From).ToList();
    }

    public async Task<TodoResponseDto?> GetByIdAsync(int id)
    {
        var todo = await _db.Todos.AsNoTracking().FirstOrDefaultAsync(t => t.Id == id);
        return todo is null ? null : TodoResponseDto.From(todo);
    }

    public async Task<TodoResponseDto> CreateAsync(CreateTodoDto dto)
    {
        var todo = new Todo
        {
            Title = dto.Title.Trim(),
            Description = dto.Description?.Trim(),
            Priority = dto.Priority,
            Category = dto.Category,
            IsCompleted = dto.IsCompleted,
            CreatedAt = DateTime.UtcNow
        };

        _db.Todos.Add(todo);
        await _db.SaveChangesAsync();
        return TodoResponseDto.From(todo);
    }

    public async Task<TodoResponseDto?> UpdateAsync(int id, UpdateTodoDto dto)
    {
        var todo = await _db.Todos.FindAsync(id);
        if (todo is null) return null;

        todo.Title = dto.Title.Trim();
        todo.Description = dto.Description?.Trim();
        todo.Priority = dto.Priority;
        todo.Category = dto.Category;
        todo.IsCompleted = dto.IsCompleted;

        await _db.SaveChangesAsync();
        return TodoResponseDto.From(todo);
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var todo = await _db.Todos.FindAsync(id);
        if (todo is null) return false;

        _db.Todos.Remove(todo);
        await _db.SaveChangesAsync();
        return true;
    }
}