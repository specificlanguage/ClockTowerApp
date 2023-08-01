import {Player, WebsocketMessage} from "../types.ts";

/**
 * updatePlayers - Translates the websocket message to a partial update for a GameState.
 * @param message - The websocket message to parse
 */
export function updatePlayers(message: WebsocketMessage) {
    if(!message.players){
        return {}
    }
    const players: Player[] = [];
    for(const uuidKey in message.players){
        const player = message.players[uuidKey]
        players.push({name: player.name, uuid: player.uuid,
            ...(player.isStoryteller && {isStoryteller: player.isStoryteller} )})
    }
    return {
        players
    }
}

/**
 * Translates a websocket message for CLIENT_JOIN to a partial update for a GameState
 * @param message - The websocket message to parse
 * @param players - A list of players that will be added and used in a new GameState update
 */
export function getAndAddPlayer(message: WebsocketMessage, players: Player[]){
    const newPlayers = [...players]
    newPlayers.push({name: message.name, uuid: message.uuid,
            ...(message.isStoryteller && {isStoryteller: message.isStoryteller})})
    return newPlayers;
}

/**
 * Translates a websocket message for CLIENT_DISCONNECT to a partial update for a GameState
 * @param message - The websocket message to parse
 * @param players - A list of players from the GameState to remove
 */
export function removePlayer(message: WebsocketMessage, players: Player[]){
    return players.filter(pl => pl.uuid != message.uuid)
}