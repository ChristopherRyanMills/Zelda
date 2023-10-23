import { useState } from "react"


export const DungeonForm = () => {

    //dungeon selector
    const [dungeonArray, setDungeonArray] = useState([])
    const [dungeon, update] = useState()
    const [monsterArray, setMonsterArray] = useState([])

    useEffect(() => {
        GetDungeonArray().then(setDungeonArray)
        GetAllMonsters().then(setMonsterArray)
    },[])

    return (
        <>
            <form>
            <h2>Dungeon Selector</h2>
            <fieldset>
                <label htmlFor="dungeon">Dungeon:</label>
                <select onChange={
                     (evt) => {
                        const copy = {...dungeon}
                        copy.Id = evt.target.value
                        update(copy)
                    }
                }>
                    <option value="0">I am a dropdown...</option>
                        {dungeonArray.map((d) => {
                            return <option value={d.id}>{d.name}</option>
                        })}
                </select>
            </fieldset>
            <h3>Monster List</h3>
            <fieldset>
                <label>
                <input type="checkbox" />
                A name
                </label>
            </fieldset>
            </form>
        </>
    )
    //monster selector

}