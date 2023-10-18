using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Zelda.Data;
using Microsoft.EntityFrameworkCore;
using Zelda.Models;
using Microsoft.AspNetCore.Identity;

namespace Zelda.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UserDungeonController : ControllerBase
{
    private ZeldaDbContext _dbContext;

    public UserDungeonController(ZeldaDbContext context)
    {
        _dbContext = context;
    }

    [HttpGet]
    [Authorize]
    public IActionResult Get()
    {
        return Ok(_dbContext.UserDungeons.ToList());
    }

    [HttpGet("{id}")]
    [Authorize]
    public IActionResult GetById(int id)
    {
        return Ok(_dbContext.UserDungeons.SingleOrDefault(ud => ud.Id == id));
    }

    [HttpPost]
    [Authorize]
    public IActionResult CreateUserDungeon(UserDungeon userDungeon)
    {
        _dbContext.UserDungeons.Add(userDungeon);
        _dbContext.SaveChanges();
        return Created($"/api/userdungeon/{userDungeon.Id}", userDungeon);
    }

    [HttpDelete("{id}")]
    [Authorize]
    public IActionResult DeleteUserDungeon(int id)
    {
        UserDungeon deleteMe = _dbContext.UserDungeons.SingleOrDefault(ud => ud.Id == id);
        if (deleteMe == null)
        {
            return NotFound();
        }

        _dbContext.UserDungeons.Remove(deleteMe);
        _dbContext.SaveChanges();
        return NoContent();
    }
}