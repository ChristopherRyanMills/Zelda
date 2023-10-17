using System.Text.Json.Serialization;
namespace Zelda.Models;

public class DungeonResponse
{
    [JsonPropertyName("success")]
    public bool Success {get; set; }

    [JsonPropertyName("count")]
    public int Count {get; set; }

    [JsonPropertyName("data")]
    public List<DungeonData> Data {get; set; }
}

public class DungeonData
{
    [JsonPropertyName("appearances")]
    public string Appearances {get; set; }

    [JsonPropertyName("name")]
    public string Name {get; set; }

    [JsonPropertyName("description")]
    public string Description {get; set; }

    [JsonPropertyName("id")]
    public string Id {get; set; }
}