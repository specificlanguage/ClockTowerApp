export enum GamePhase {
    LOADING = "LOADING", // Default when entering room
    GAME_LOBBY = "LOBBY", // Landing page on lobby
    NIGHT = "NIGHT", // Most logic will happen at night
    POSTNIGHT = "POSTNIGHT", // Should be used for post
    DAY = "DAY", // General deliberation for the day
    NOMINATE = "NOMINATE", // Nominating voters
    DELIBERATION = "DELIBERATION", // Should be used as a stopgap between nominations and voting
    VOTING = "VOTING",
    POSTVOTE = "POSTVOTE", // Should be used for resolution events regarding the voting, and special roles like Vizier
    POSTDAY = "POSTDAY"
}

export enum MessageType {
    MESSAGE           = "MESSAGE",
    CLIENT_JOIN       = "CLIENT_JOIN",
    CLIENT_DISCONNECT = "CLIENT_DISCONNECT",
    ERROR             = "ERROR",
    GAME_INFO         = "GAME_INFO",
    GAME_SETUP        = "GAME_SETUP"
}
