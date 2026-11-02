using WebApplication1.DTOs;
using WebApplication1.Models;

namespace WebApplication1.Services;

public interface ITodoService
{
    Task<List<TodoResponseDto>> GetAllAsync(string? search, Category? category, Priority? priority);
    Task<TodoResponseDto?> GetByIdAsync(int id);
    Task<TodoResponseDto> CreateAsync(CreateTodoDto dto);
    Task<TodoResponseDto?> UpdateAsync(int id, UpdateTodoDto dto);
    Task<bool> DeleteAsync(int id);
}