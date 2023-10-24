using System.ComponentModel.DataAnnotations;

namespace Zelda.Models
{
    public class DungeonPopulation
    {
        public int Id {get; set; }
        [Required]
        public string MonsterId {get; set; }
        //public MonsterResponse Monster {get; set; }
        public int UserDungeonId {get; set; }
        //public UserDungeon UserDungeon {get; set; }
    }
}