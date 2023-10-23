const _apiUrl = "/api/dungeon"

export const GetDungeonArray = () => {
    return fetch(_apiUrl).then((res) => res.json())
}