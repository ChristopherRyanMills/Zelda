const _apiUrl = "/api/dungeonpopulation"

export const GetPopulationByUserId = (id) => {
    //actually getting by userdungeon Id
    return fetch(`${_apiUrl}/user/${id}`).then((res) => res.json())
}

//post new dungeon pop

export const makeNewPopulation = (obj) => {
    return fetch(_apiUrl, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(obj)}).then((res) => res.json())
}