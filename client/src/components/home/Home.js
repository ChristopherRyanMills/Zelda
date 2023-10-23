import { useEffect, useState } from "react"
import { UserDungeonList } from "./UserDungeonList"
import { getDungeonsByUser } from "../../managers/userDungeonManager"
import { GetPopulationByUserId } from "../../managers/dungeonPopulationManager"
import { Button } from "reactstrap"
import { useNavigate } from "react-router-dom"
export const Home = ({ loggedInUser }) => {
    console.log(loggedInUser);
    const [dungeonPopulations, setDungeonPopulations] = useState(null);
    const [userDungeons, setUserDungeons] = useState(null);
    const navigate = useNavigate()
    const render = () => {
        GetPopulationByUserId(loggedInUser.id).then(setDungeonPopulations)
        getDungeonsByUser(loggedInUser.id).then(setUserDungeons)
    } 

    useEffect(() => {
        render()
    },[])

    return (
        <>
        <div className="user_container">
            <h2>Welcome, {loggedInUser.firstName}.</h2>
        </div>

        <div className="dungeon_list_container">
            <h3>Your Dungeons</h3>
            {userDungeons ? (
                <UserDungeonList dungeonPopulations={dungeonPopulations} userDungeons={userDungeons}/>
            ) : <p>Wow. Many blank. Much empty.</p>
            }
            <Button onClick={navigate("/new")}>Populate a Dungeon</Button>
        </div>
        </>
    )
}