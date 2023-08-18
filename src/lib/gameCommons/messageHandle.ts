import {GameState, Player, WebsocketMessage} from "../types.ts";
import {MessageType} from "../gameConsts.ts";
import {isStoryteller} from "./gameAndPlayerUtilities.ts";

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
    // Don't update if it already exists
    if (players.filter((pl) => pl.uuid == message.uuid).length >= 1){
        newPlayers.filter((pl) => pl.uuid == message.uuid)[0].name = message.name;
        return newPlayers;
    } else {
        newPlayers.push({name: message.name, uuid: message.uuid,
            ...(message.isStoryteller && {isStoryteller: message.isStoryteller})})
        return newPlayers;
    }
}

/**
 * Translates a websocket message for CLIENT_DISCONNECT to a partial update for a GameState
 * @param message - The websocket message to parse
 * @param players - A list of players from the GameState to remove
 */
export function removePlayer(message: WebsocketMessage, players: Player[]){
    return players.filter(pl => pl.uuid != message.uuid)
}

interface RoleObject {
    uuid: string,
    role: string
}

/**
 * Updates the roles for all players from the Websocket message
 * @param message - The RoleObject with numPlayers, roles of all players
 * @param players - The players list
 */
export function updateRoles(message: WebsocketMessage, players: Player[]){
    message.roles.map((obj: RoleObject) => {
        players.filter((pl) => pl.uuid == obj.uuid)[0].role = obj.role;
    })
}

/**
 * Does all the heavy lifting for parsing a Websocket Message and then doing each appropriate action.
 * @param message - Websocket message
 * @param gameState - GameState of the game
 * @param setGameState - A function that sets that gameState
 * @param updateMessageHistory - Optional function to update message history as well.
 */
export function parseMessage(message: MessageEvent<any> | null,
                             gameState: GameState,
                             setGameState: (state: GameState) => void,
                             updateMessageHistory?: (msg: any) => void) {
    if(message == null){
        return;
    }

    const parsedMsg = JSON.parse(message.data);
    if(updateMessageHistory != undefined) {
        updateMessageHistory(parsedMsg);
    }

    if(parsedMsg.type == MessageType.GAME_INFO){
        updatePlayers(parsedMsg.message);
    } else if (parsedMsg.type == MessageType.CLIENT_JOIN){
        const players = getAndAddPlayer(parsedMsg.message, gameState.players)
        setGameState({
            ...gameState,
            players
        })
    } else if (parsedMsg.type == MessageType.CLIENT_DISCONNECT){
        removePlayer(parsedMsg.message, gameState.players)
    } else if (parsedMsg.type == MessageType.GAME_SETUP){
        if(isStoryteller(gameState)) {
            updateRoles(parsedMsg.message, gameState.players)
        } else {
            setGameState({
                ...gameState,
                role: parsedMsg.message.role,
                maxPlayers: parsedMsg.message.numPlayers
            })
        }
    } else if (parsedMsg.type == MessageType.ERROR) {
        console.log(parsedMsg.message)
    }
}