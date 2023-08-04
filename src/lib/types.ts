import {GamePhase, MessageType} from "./gameConsts.ts";

export enum RoleType {
    TOWNSFOLK,
    OUTSIDER,
    MINION,
    DEMON,
    TRAVELER
}

export interface Player {
    name: string;
    uuid: string;
    imageURL?: string;
    role?: string;
    isStoryteller?: boolean
}

export interface PlayerIconProps {
    name: string;
    imageURL?: string;
    size?: number;
}

export interface GameCircleProps {
    players: Player[];
}

export interface PlayerListProps {
    players: Player[];
}

export interface Role {
    role_name: string
    description: string
    team: number
}

export interface WebsocketMessage {
    time: Date,
    type: MessageType,
    [id: string]: any
}

export interface GameState {
    phase: GamePhase,
    players: Player[]
    code: string,
    script: string,
    maxPlayers: number,
}