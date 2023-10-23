using System.Text.Json.Serialization;
using System.ComponentModel.DataAnnotations;
namespace Zelda.Models;

public class MonsterResponse
{
    public int Id {get; set; }
    
    [JsonPropertyName("success")]
    public bool Success {get; set; }

    [JsonPropertyName("count")]
    public int Count {get; set; }

    [JsonPropertyName("data")]
    public List<Monster> Data {get; set; }
    public class Monster
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

