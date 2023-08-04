import { atom } from 'jotai';
import {GameState} from "../lib/types.ts";
import {GamePhase} from "../lib/gameConsts.ts";
import {atomWithReset} from "jotai/utils";

// Stores the game code of the current game.
export const gameCodeAtom = atom("")

// Stores the given name of your client
export const nameAtom = atom("")
export const uuidAtom = atom("")
export const gameStateAtom = atomWithReset<GameState>({
    phase: GamePhase.LOADING,
    players: [],
    code: "",
    script: "Trouble Brewing",
    maxPlayers: 16
})