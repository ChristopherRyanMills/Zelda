const _apiUrl = "/api/dungeonpopulation"

export const GetPopulationByUserId = (id) => {
    return fetch(`${_apiUrl}/user/${id}`).then((res) => res.json())
}