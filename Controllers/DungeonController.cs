using Microsoft.AspNetCore.Mvc;
using Zelda.Data;
using Zelda.Models;

namespace Zelda.Controllers;

[ApiController]
[Route("api/[controller]")]
public class DungeonController : ControllerBase
{
    private ZeldaDbContext _dbContext;
    private ZeldaAPIService _dungeonService;
    public DungeonController(ZeldaDbContext context, ZeldaAPIService data)
    {
        _dbContext = context;
        _dungeonService = data;
    }

    [HttpGet]
    public async Task<IActionResult> GetAllDungeons()
    {
        var dungeon = await _dungeonService.GetAllDungeons();
        return Ok(dungeon.Data.ToList());
    }
}