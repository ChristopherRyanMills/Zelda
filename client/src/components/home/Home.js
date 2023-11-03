import { useEffect, useState } from "react"
import { UserDungeonList } from "./UserDungeonList"
import { getDungeonsByUser } from "../../managers/userDungeonManager"
import { GetPopulationByUserId } from "../../managers/dungeonPopulationManager"
import { Button, Card } from "reactstrap"
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
        <><div className="bg-dark dungeonformcontainer text-center">
        <Card className="bg-dark text-white-50">
            <h2>Welcome, {loggedInUser.firstName}.</h2>
        </Card>

        <div className='bg-dark text-white-50 pt-5'>
            <h3 className="fw-bold">Your Dungeons</h3>
            {userDungeons ?  (
                <UserDungeonList dungeonPopulations={dungeonPopulations} userDungeons={userDungeons} dungeonPopulationsMap={dungeonPopulationsMap} rerender={rerender}/>
            ) : <p>Wow. Many blank. Much empty.</p>
            }
            <Button onClick={() => {navigate("/new")}} color="success" className="mt-2 mb-5">Populate a Dungeon</Button>
        </div>
        <Button onClick={() => {navigate("/game")}} color="success" className="mt-4">I hate this site! I wanna play Zelda!</Button>
        </div>
        </>
    )
}