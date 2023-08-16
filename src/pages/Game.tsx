import {useAtom} from "jotai";
import {gameCodeAtom, gameStateAtom, nameAtom} from "../stores/atom.ts";
import ScriptView from "../components/ScriptView.tsx";
import {useEffect, useState} from "react";
import useWebSocket from "react-use-websocket";
import {WebsocketMessage} from "../lib/types.ts";
import {useNavigate} from "react-router-dom";
import {GamePhase, MessageType} from "../lib/gameConsts.ts";
import {getAndAddPlayer, removePlayer, updatePlayers} from "../lib/gameCommons/messageHandle.ts";
import LobbyInfo from "../components/LobbyInfo.tsx";
import PlayerList from "../components/PlayerList.tsx";
import {getStorytellerInfo} from "../lib/gameCommons/gameAndPlayerUtilities.ts";

export default function Game () {

    const [gameID] = useAtom(gameCodeAtom);
    const [name] = useAtom(nameAtom);
    const [gameState, setGameState] = useAtom(gameStateAtom);
    const SOCKET_URL =`${import.meta.env.VITE_WEBSOCKET_URL}/game/${gameID}?name=${name}&uuid=${localStorage.getItem("uuid")}`

    const [loaded, setLoaded] = useState(false);
    const [messageHistory, setMessageHistory] = useState<WebsocketMessage[]>([]);

    const {lastMessage, readyState,} = useWebSocket(SOCKET_URL);

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
                setGameState({
                    ...gameState,
                    role: parsedMsg.message.role,
                    maxPlayers: parsedMsg.message.numPlayers
                })
            }
        }

    }, [lastMessage]);

    if(getStorytellerInfo(gameState)?.uuid == localStorage.getItem("uuid")){
        navigate("/storyteller")
    }

    return (
        <div className="grid gap-1 grid-cols-2 grid-rows-1 h-full">
            <ScriptView/>
            <div className="grid gap-4 grid-rows-2 grid-cols-1">
                <LobbyInfo messageHistory={messageHistory} disablePlayerChange={true}/>
                <PlayerList players={gameState.players}/>
            </div>
        </div>
    )


}