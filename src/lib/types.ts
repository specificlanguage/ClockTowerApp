export interface Player {
    name: string;
    imageURL?: string;
    role?: string;
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