import {useAtom} from "jotai";
import {gameCodeAtom, gameStateAtom, nameAtom} from "../stores/atom.ts";
import {useEffect, useState} from "react";
import useWebSocket from "react-use-websocket";
import PlayerList from "../components/PlayerList.tsx";
import {GamePhase, MessageType} from "../lib/gameConsts.ts";
import {getAndAddPlayer, removePlayer, updatePlayers} from "../lib/gameCommons/messageHandle.ts";
import LobbyInfo from "../components/LobbyInfo.tsx";
import {useNavigate} from "react-router-dom";
import RoleSelect from "../components/RoleSelect.tsx";
import {WebsocketMessage} from "../lib/types.ts";
import {getStorytellerInfo} from "../lib/gameCommons/gameAndPlayerUtilities.ts";


export default function Storyteller () {

    const [gameID] = useAtom(gameCodeAtom);
    const [name] = useAtom(nameAtom);
    const [gameState, setGameState] = useAtom(gameStateAtom);
    const SOCKET_URL =`${import.meta.env.VITE_WEBSOCKET_URL}/game/${gameID}?name=${name}&uuid=${localStorage.getItem("uuid")}`

    const [loaded, setLoaded] = useState(false);
    const [messageHistory, setMessageHistory] = useState<WebsocketMessage[]>([]);

    const {lastMessage, readyState} = useWebSocket(SOCKET_URL);

    const navigate = useNavigate();

    if(gameID == "" || name == "" || localStorage.getItem("uuid") == null){
        navigate("/")
    }

    useEffect(() => {

        if(readyState === WebSocket.CLOSED){
            console.log("Websocket disconnected")
            navigate("/")
        }

        if(!loaded) {
            setLoaded(true);
            setGameState({
                ...gameState,
                code: gameID,
                phase: GamePhase.GAME_LOBBY
            })
        }

        if(lastMessage !== null){
            const parsedMsg = JSON.parse(lastMessage.data);
            setMessageHistory((prevState) => prevState.concat(
                {
                    ...parsedMsg, time: new Date()
                }))

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

        if(getStorytellerInfo(gameState)?.uuid != localStorage.getItem("uuid")){
            navigate("/game")
        }

    }, [lastMessage]);

    return (
        <div className="grid gap-4 grid-cols-2 grid-rows-1 h-full">
            <RoleSelect/>
            <div className="grid gap-4 grid-rows-2 grid-cols-1">
                <LobbyInfo messageHistory={messageHistory} disablePlayerChange={false}/>
                <PlayerList players={gameState.players}/>
            </div>
        </div>
    )


}