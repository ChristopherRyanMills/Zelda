const _apiUrl = "/api/monster"

export const GetAllMonsters = () => {
    return fetch(_apiUrl).then((res) => res.json())
}