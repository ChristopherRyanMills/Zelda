import { useEffect, useState } from "react"
import { GetDungeonArray } from "../../managers/dungeonManager"
import { GetAllMonsters } from "../../managers/monsterManager"
import { Button } from "reactstrap"
import { useNavigate } from "react-router-dom"
import { makeNewUserDungeon } from "../../managers/userDungeonManager"
import { makeNewPopulation } from "../../managers/dungeonPopulationManager"

export const DungeonForm = ({ loggedInUser }) => {

    //dungeon selector
    const [dungeonArray, setDungeonArray] = useState([])
    const [dungeon, update] = useState()
    const [monsterArray, setMonsterArray] = useState([])
    const [monstersInDungeon, setMonstersInDungeon] = useState([])
    const navigate = useNavigate()

    useEffect(() => {
        GetDungeonArray().then(setDungeonArray)
        GetAllMonsters().then(setMonsterArray)
    },[])

    const handleCheckboxes = (monId) => {
        //check if the monster Id is already in the array of dungeon pop
        const matchingMonIndex = monstersInDungeon.findIndex(
            (mid) => mid === monId
        )
        //if it exists, unassign it
        if (matchingMonIndex !== -1) {
            setMonstersInDungeon((prevMiD) => 
            prevMiD.filter((mid) => mid !== monId))
        }
        //else, assign it
        else {
            setMonstersInDungeon((prevMiD) => [
                ...prevMiD, monId,
            ])
        }
    }

    const handleSubmitClick = (e) => {
        e.preventDefault()
        const userDungeonObj = {userId: loggedInUser.id, dungeonId: dungeon.id}
        console.log(userDungeonObj)
        makeNewUserDungeon(userDungeonObj).then((response) => {(monstersInDungeon.map((mid) => {
            const newPopulation = {monsterId: mid, userDungeonId: response.id}
            makeNewPopulation(newPopulation)
        }))}).then(navigate("/"))

    }

    return (
        <><div className="bg-dark text-white-50 dungeonformcontainer text-center">
            <form onSubmit={(e)=>{handleSubmitClick(e)}}>
            <h2 className="text-danger">Dungeon Selector</h2>
            <fieldset>
                <label htmlFor="dungeon">Dungeon:</label>
                <select onChange={
                     (evt) => {
                        const copy = {...dungeon}
                        copy.id = evt.target.value
                        update(copy)
                    }
                }>
                    <option value="0">Select Dungeon</option>
                        {dungeonArray.map((d) => {
                            return <option value={d.id}>{d.name}</option>
                        })}
                </select>
            </fieldset>
            {/*Should there be a button to lock in the dungeon type? How do? */}
            <h3 className="text-danger">Monster List</h3>
            <fieldset>
                <div className="checkboxContainer">
                    {monsterArray.map((mon) => (
                        <div key={mon.id}>
                            <input 
                            type="checkbox"
                            onChange={() => handleCheckboxes(mon.id)}
                            //superduperhandler needs to handle fetch calls for monpop table
                            checked={monstersInDungeon.some((mid) => mid === mon.id)}
                            />
                            <label className="monsterName">{mon.name}</label>
                        </div>
                    ))}
                </div>
            </fieldset>
            <Button className="mt-3">Submit</Button>
            {/*onClick={(e) => handleSubmitClick(e)} */}
            </form>
            </div>
        </>
    )
    //monster selector

}