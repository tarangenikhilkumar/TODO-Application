using System.ComponentModel.DataAnnotations;
using WebApplication1.Models;

namespace WebApplication1.DTOs;

public class CreateTodoDto
{
    [Required(ErrorMessage = "Title is required.")]
    [StringLength(100, ErrorMessage = "Title cannot be longer than 100 characters.")]
    public string Title { get; set; } = string.Empty;

    [StringLength(500, ErrorMessage = "Description cannot be longer than 500 characters.")]
    public string? Description { get; set; }

    public Priority Priority { get; set; } = Priority.Medium;
    public Category Category { get; set; } = Category.Work;
    public bool IsCompleted { get; set; }
}

public class UpdateTodoDto : CreateTodoDto { }

public record TodoResponseDto(
    int Id,
    string Title,
    string? Description,
    Priority Priority,
    Category Category,
    bool IsCompleted,
    DateTime CreatedAt)
{
    public static TodoResponseDto From(Todo t) =>
        new(t.Id, t.Title, t.Description, t.Priority, t.Category, t.IsCompleted, t.CreatedAt);
}