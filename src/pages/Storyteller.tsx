import {useAtom} from "jotai";
import {gameCodeAtom, nameAtom} from "../stores/atom.ts";
import ScriptView from "../components/ScriptView.tsx";
import {useEffect, useState} from "react";
import useWebSocket from "react-use-websocket";
import PlayerList from "../components/PlayerList.tsx";
import {GamePhase, MessageType} from "../lib/gameConsts.ts";
import {getAndAddPlayer, removePlayer, updatePlayers} from "../lib/gameCommons/messageHandle.ts";
import {GameState} from "../lib/types.ts";

export default function Storyteller () {

    const [gameID] = useAtom(gameCodeAtom);
    const [name] = useAtom(nameAtom);
    const [gameState, setGameState] = useState<GameState>({
        phase: GamePhase.LOADING,
        players: []
    })
    const [loaded, setLoaded] = useState(false);
    const socketURL =`${import.meta.env.VITE_WEBSOCKET_URL}/game/${gameID}?name=${name}&uuid=${localStorage.getItem("uuid")}`

    const {lastMessage, } = useWebSocket(socketURL)

    useEffect(() => {
        if(!loaded) {
            setLoaded(true);
            setGameState({
                ...gameState,
                phase: GamePhase.GAME_LOBBY
            })
        }

        if(lastMessage !== null){

            const parsedMsg = JSON.parse(lastMessage.data);
            console.log(typeof  parsedMsg, parsedMsg)

            if(parsedMsg.type == MessageType.GAME_INFO){
                const players = updatePlayers(parsedMsg.message);
                setGameState({
                    ...gameState,
                    ...players
                })
            } else if (parsedMsg.type == MessageType.CLIENT_JOIN){
                const players = getAndAddPlayer(parsedMsg.message, gameState.players)
                setGameState({
                    ...gameState,
                    players
                })
            } else if (parsedMsg.type == MessageType.CLIENT_DISCONNECT){
                const players = removePlayer(parsedMsg.message, gameState.players)
                setGameState({
                    ...gameState,
                    players
                })
            }
        }
    }, [lastMessage]);

    return (
        <div className="grid gap-4 grid-cols-2 grid-rows-1 h-full">
            <ScriptView/>
            <div className="grid gap-4 grid-rows-2 grid-cols-1">
                <div className="bg-white">
                    <p className="align-middle">Code: {gameID}</p>
                    {gameState.phase}
                </div>
                <PlayerList players={gameState.players}/>
            </div>
        </div>
    )


}