using System.Net;
using Zelda.Models;

namespace Zelda.Data;

public class ZeldaAPIService
{
    private HttpClient _client;


    public ZeldaAPIService()
    {
        _client = new HttpClient();
    }

    public async Task<DungeonResponse> GetAllDungeons()
    {
        var uri = $"https://zelda.fanapis.com/api/dungeons";
        DungeonResponse dungeonResponse = await _client.GetFromJsonAsync<DungeonResponse>(uri);

        return dungeonResponse;
    }

    public async Task<MonsterResponse> GetAllMonsters()
    {
        var uri = $"https://zelda.fanapis.com/api/monsters";
        MonsterResponse monsterResponse = await _client.GetFromJsonAsync<MonsterResponse>(uri);

        return monsterResponse;
    }
}