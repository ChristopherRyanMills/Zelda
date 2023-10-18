using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Zelda.Data;
using Zelda.Models;

namespace Zelda.Controllers;

[ApiController]
[Route("api/[controller]")]
public class MonsterController : ControllerBase
{
    private ZeldaDbContext _dbContext;
    private ZeldaAPIService _monsterService;
    public MonsterController(ZeldaDbContext context, ZeldaAPIService data)
    {
        _dbContext = context;
        _monsterService = data;
    }

    [HttpGet]
    public async Task<IActionResult> GetAllMonsters()
    {
        var monster = await _monsterService.GetAllMonsters();
        return Ok(monster.Data.ToList());
    }

    [HttpGet("{id}")]
    [Authorize]
    public async Task<IActionResult> GetById(string id)
    {
        var monster = await _monsterService.GetAllMonsters();
        return Ok(monster.Data.SingleOrDefault(d => d.Id == id));
    }
}