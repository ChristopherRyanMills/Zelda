using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Zelda.Data;
using Microsoft.EntityFrameworkCore;
using Zelda.Models;
using Microsoft.AspNetCore.Identity;

namespace Zelda.Controllers;

[ApiController]
[Route("api/[controller]")]
public class DungeonPopulationController : ControllerBase
{
    private ZeldaDbContext _dbContext;

    public DungeonPopulationController(ZeldaDbContext context)
    {
        _dbContext = context;
    }

    [HttpGet("user/{id}")]
    //[Authorize]
    public IActionResult GetByUserId(int id)
    {
        return Ok(_dbContext.DungeonPopulations.Include(dp => dp.UserDungeon).Where(dp => dp.UserDungeon.UserId == id).ToList());
    }

    [HttpGet("{id}")]
    //[Authorize]
    public IActionResult GetById(int id)
    {
        return Ok(_dbContext.DungeonPopulations.SingleOrDefault(dp => dp.Id == id));
    }

    [HttpPost]
    //[Authorize]
    public IActionResult CreateDungeonPopulation(DungeonPopulation dungeonPopulation)
    {
        _dbContext.DungeonPopulations.Add(dungeonPopulation);
        _dbContext.SaveChanges();
        return Created($"/api/dungeonpopulation/{dungeonPopulation.Id}", dungeonPopulation);
    }

    [HttpDelete("{id}")]
    //[Authorize]
    public IActionResult DeleteDungeonPopulation(int id)
    {
        DungeonPopulation deleteMe = _dbContext.DungeonPopulations.SingleOrDefault(dp => dp.Id == id);
        _dbContext.DungeonPopulations.Remove(deleteMe);
        _dbContext.SaveChanges();
        return NoContent();
    }
}