import { useEffect, useState } from "react"
import { GetDungeonArray } from "../../managers/dungeonManager"
import { Button } from "reactstrap"
import { GetAllMonsters } from "../../managers/monsterManager"
import { removeUserDungeon } from "../../managers/userDungeonManager"
import { useNavigate } from "react-router-dom"


export const UserDungeonList = ({dungeonPopulations, userDungeons, dungeonPopulationsMap, rerender}) => {
    const [dungeonArray, setDungeonArray] = useState([])
    const [monsterArray, setMonsterArray] = useState([])
    const navigate = useNavigate()

    useEffect(() => {
        GetDungeonArray().then(setDungeonArray)
        GetAllMonsters().then(setMonsterArray)
    },[])

    const deleteButton = (id) => {
        removeUserDungeon(id).then(()=> {rerender()})
    }

    return (
        <>
            {userDungeons?.map(ud => {
                const matchingD = dungeonArray.find(dungeon => dungeon.id === ud.dungeonId)
                // const matchingPops = dungeonPopulations.filter(dp => dp.userDungeon.id === ud.id)

                return <div className="dungeon_card">
                    <h3>{matchingD?.name}</h3>
                    {/*this is returning undefined but refreshing is fine*/}
                    <div className="monster_box">
                        {dungeonPopulationsMap[ud.id]?.map(mp => {
                            const matchingMon = monsterArray.find(mon => mon.id === mp.monsterId)

                            return <p>{matchingMon.name}</p>
                        })}
                    </div>
                    <Button>Edit</Button>
                    <Button onClick={()=> deleteButton(ud.id)}>Delete</Button>
                </div>
            })}
        </>
    )
}