import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { getSingleUserDungeon } from "../../managers/userDungeonManager"
import { GetPopulationByUserId, makeNewPopulation, removeDungeonPopById } from "../../managers/dungeonPopulationManager"
import { Button } from "reactstrap"
import { GetDungeonArray } from "../../managers/dungeonManager"
import { GetAllMonsters } from "../../managers/monsterManager"


export const EditDungeonForm = () => {
    const [userDungeon, setUserDungeon] = useState()
    const {udId} = useParams()
    const [dungeonArray, setDungeonArray] = useState([])
    const [monsterArray, setMonsterArray] = useState([])
    const [matchingD, setMatchingD] = useState()
    const [dungeonPopulations, setDungeonPopulations] = useState([])
    const navigate = useNavigate()

    useEffect(() => {
        getSingleUserDungeon(udId).then(setUserDungeon)
        GetDungeonArray().then(setDungeonArray)
        GetAllMonsters().then(setMonsterArray)
    },[])

    useEffect(()=>{
        setMatchingD(dungeonArray.find(da => da.id === userDungeon.dungeonId))
    },[dungeonArray])

    useEffect(()=> {
        GetPopulationByUserId(udId).then(setDungeonPopulations)
    },[userDungeon])

    const handleCheckboxes = (monsterId) => {
        const matchingPopIndex = dungeonPopulations.findIndex(dp => dp.monsterId === monsterId)

        if (matchingPopIndex !== -1) {
            //fetch delete the dungeonpop and setdungeonpop to prev list filtered dp.monsterId !== monsterId
            removeDungeonPopById(dungeonPopulations[matchingPopIndex].id).then(() =>{
                setDungeonPopulations((prevDunPop) => 
                prevDunPop.filter((pdp)=> pdp.monsterId !== monsterId))
            })
            
        }
        else {
            //post new dungeonpop with monId and udId and do the getpop fetch / setdunpop combo again
            const newDunPop = {monsterId: monsterId, userDungeonId: udId}
            makeNewPopulation(newDunPop).then(()=> {
                GetPopulationByUserId(udId).then(setDungeonPopulations)
            })

        }
    }

    return (
        <>
            <h2>Edit Page</h2>
            <h3>{matchingD?.name}</h3>
            <p>{matchingD?.description}</p>
            <form>
            <h3>Monster List</h3>
            <fieldset>
                <div className="checkboxContainer">
                    {monsterArray?.map((mon) => (
                        <div key={mon.id}>
                            <input 
                            type="checkbox"
                            onChange={() => handleCheckboxes(mon.id)}
                            //superduperhandler needs to handle fetch calls for monpop table
                            checked={dungeonPopulations.some((dp) => dp.monsterId === mon.id)}
                            />
                            <label className="monsterName">{mon.name}</label>
                        </div>
                    ))}
                </div>
            </fieldset>
            <Button onClick={() =>{navigate("/")}}>Done</Button>
            </form>
            
        </>
    )
}