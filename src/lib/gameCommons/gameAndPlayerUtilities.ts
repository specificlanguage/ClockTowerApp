import {GameState, Player, Role, RoleType} from "../types.ts";

/**
 * Checks who is the storyteller in the player list.
 * @param gameState - GameState object (which includes players)
 */
export function getStorytellerInfo(gameState: GameState): Player | null {
    for(const player of gameState.players){
        if(player.isStoryteller){
            return player;
        }
    }
    return null;
}

export interface RoleItems {
    townsfolk: Role[],
    outsiders: Role[],
    minions: Role[],
    demons: Role[]
}

export interface RoleListResponse {
    roles: Role[]
}

/**
 * Separates out the roles for each class.
 * @param data - An object that contains a full list of roles.
 */
export function separateRoles(data: RoleListResponse): RoleItems {
    const roleItems: RoleItems = {
        townsfolk: [],
        outsiders: [],
        minions: [],
        demons: []
    }

    const roles: Role[] = data.roles
    roles.map((role: Role) => {
        switch (role.team){
            case 0:
                roleItems.townsfolk.push(role)
                break
            case 1:
                roleItems.outsiders.push(role)
                break
            case 2:
                roleItems.minions.push(role)
                break
            case 3:
                roleItems.demons.push(role)
                break
        }
    })
    return roleItems
}

/**
 * Calculates the maximum number of roles for a given team. This is generally accurate up to 15.
 * @param players - Number of players to calculate roles for.
 * @param type - The type of role that needs to be calculated
 */
export function numRole(players: number, type: RoleType): number {
    if (players <= 4){
        return -1
    }
    switch (type) {
        case RoleType.TOWNSFOLK:
            return Math.ceil(players / 3 + 1)
        case RoleType.OUTSIDER: // TODO: doesn't work with godfather
            if (players < 7){
                return players - 5
            } else {
                return players % 3
            }
        case RoleType.MINION:
            return Math.max(1, Math.ceil(players / 3) - 2)
        case RoleType.DEMON:
            return 1;
    }
    return -1
}

/**
 * Returns a copy of the roles list given with the role removed.
 * @param roles - The roles list
 * @param role - Role to remove
 */
export function removeRoleFromList(roles: Role[], role: Role): Role[]{
    const roleCopy = roles.slice()
    const i = roleCopy.indexOf(role)
    if(i != -1){
        roleCopy.splice(i, 1)
    }
    return roleCopy
}

