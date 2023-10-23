import { useEffect, useState } from "react"
import { GetDungeonArray } from "../../managers/dungeonManager"
import { Button } from "reactstrap"
import { GetAllMonsters } from "../../managers/monsterManager"


export const UserDungeonList = ({dungeonPopulations, userDungeons}) => {
    const [dungeonArray, setDungeonArray] = useState([])
    const [monsterArray, setMonsterArray] = useState([])

    useEffect(() => {
        GetDungeonArray().then(setDungeonArray)
        GetAllMonsters().then(setMonsterArray)
    },[])

    return (
        <>
            {userDungeons.map(ud => {
                const matchingD = dungeonArray.find(dungeon => dungeon.id === ud.dungeonId)
                const matchingPops = dungeonPopulations.filter(dp => dp.userDungeon.id === ud.id)

                return <div className="dungeon_card">
                    <h3>{matchingD.name}</h3>
                    <div className="monster_box">
                        {matchingPops.map(mp => {
                            const matchingMon = monsterArray.find(mon => mon.id === mp.monsterId)

                            return <p>{matchingMon.name}</p>
                        })}
                    </div>
                    <Button>Edit</Button>
                    <Button>Delete</Button>
                </div>
            })}
        </>
    )
}