using System.Text.Json.Serialization;
using System.ComponentModel.DataAnnotations;
namespace Zelda.Models;

public class DungeonResponse
{
    [JsonPropertyName("success")]
    public bool Success {get; set; }

    [JsonPropertyName("count")]
    public int Count {get; set; }

    [JsonPropertyName("data")]
    public List<Dungeon> Data {get; set; }
    public class Dungeon
    {
        [JsonPropertyName("appearances")]
        public List<string> Appearances {get; set; }

        [JsonPropertyName("name")]
        public string Name {get; set; }

        [JsonPropertyName("description")]
        public string Description {get; set; }

        [JsonPropertyName("id")]
        public string Id {get; set; }
    }
}

