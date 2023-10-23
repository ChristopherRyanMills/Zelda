const _apiUrl = "/api/userdungeon"

export const getDungeonsByUser = (id) => {
    return fetch(`${_apiUrl}/user/${id}`).then((res) => res.json())
}