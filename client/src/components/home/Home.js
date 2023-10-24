import { useEffect, useState } from "react"
import { UserDungeonList } from "./UserDungeonList"
import { getDungeonsByUser } from "../../managers/userDungeonManager"
import { GetPopulationByUserId } from "../../managers/dungeonPopulationManager"
import { Button } from "reactstrap"
import { useNavigate } from "react-router-dom"
export const Home = ({ loggedInUser }) => {
    console.log(loggedInUser);
    const [dungeonPopulations, setDungeonPopulations] = useState([]);
    const [userDungeons, setUserDungeons] = useState([]);
    const [dungeonPopulationsMap, setDungeonPopulationsMap] = useState({})
    const navigate = useNavigate()
    
    const rerender = () => { 
        getDungeonsByUser(loggedInUser.id).then(setUserDungeons)
    } 

    useEffect(() => {
        rerender()
    },[])

    useEffect(() => {
        userDungeons.map((ud) => {
            GetPopulationByUserId(ud.id).then((pop) => {
                setDungeonPopulationsMap(prevMap => ({
                    ...prevMap,
                    [ud.id]: pop
                }))
            })
        })
    }, [userDungeons])

    return (
        <>
        <div className="user_container">
            <h2>Welcome, {loggedInUser.firstName}.</h2>
        </div>

        <div className="dungeon_list_container">
            <h3>Your Dungeons</h3>
            {userDungeons ?  (
                <UserDungeonList dungeonPopulations={dungeonPopulations} userDungeons={userDungeons} dungeonPopulationsMap={dungeonPopulationsMap} rerender={rerender}/>
            ) : <p>Wow. Many blank. Much empty.</p>
            }
            <Button onClick={() => {navigate("/new")}}>Populate a Dungeon</Button>
        </div>
        </>
    )
}