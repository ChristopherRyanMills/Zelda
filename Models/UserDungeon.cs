using System.ComponentModel.DataAnnotations;

namespace Zelda.Models
{
    public class UserDungeon
    {
        public int Id {get; set; }
        public int UserId {get; set; }
        //public UserProfile UserProfile {get; set; }
        [Required]
        public string DungeonId {get; set; }
       // public DungeonResponse Dungeon {get; set; }
    }
}