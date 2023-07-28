import { atom } from 'jotai';
import {GamePhase} from "../lib/gameConsts.ts";

// Stores the game code of the current game.
export const gameCodeAtom = atom("")

// Stores the given name of your client
export const nameAtom = atom("")
export const uuidAtom = atom("")
export const gameStateAtom = atom({
    phase: GamePhase.LOADING,
    players: 0
})