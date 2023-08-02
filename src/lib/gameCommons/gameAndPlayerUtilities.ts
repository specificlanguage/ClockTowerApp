import {GameState, Player} from "../types.ts";

export function getStorytellerInfo(gameState: GameState): Player | null {
    for(const player of gameState.players){
        if(player.isStoryteller){
            return player;
        }
    }
    return null;
}