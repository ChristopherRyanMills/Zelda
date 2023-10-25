const _apiUrl = "/api/userdungeon"

export const getDungeonsByUser = (id) => {
    return fetch(`${_apiUrl}/user/${id}`).then((res) => res.json())
}

//get single userDungeon
export const getSingleUserDungeon = (id) => {
    return fetch(`${_apiUrl}/${id}`).then((res) => res.json())
}

//post new user dungeon
export const makeNewUserDungeon = (obj) => {
    return fetch(`${_apiUrl}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(obj)}).then((res) => res.json())
}

//delete user dungeon
export const removeUserDungeon = (id) => {
    return fetch(`${_apiUrl}/${id}`, {
        method: "DELETE"
    })
}