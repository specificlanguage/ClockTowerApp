import {useAtom} from "jotai";
import {gameCodeAtom, gameStateAtom, nameAtom} from "../stores/atom.ts";
import {useEffect, useState} from "react";
import useWebSocket from "react-use-websocket";
import PlayerList from "../components/PlayerList.tsx";
import {GamePhase} from "../lib/gameConsts.ts";
import {parseMessage} from "../lib/gameCommons/messageHandle.ts";
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

    const {lastMessage, readyState, sendMessage} = useWebSocket(SOCKET_URL, {
        shouldReconnect: () => {
            return !(gameID == "" || name == "" || localStorage.getItem("uuid") == "");
        }
    });
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

        parseMessage(lastMessage, gameState, setGameState, setMessageHistory);

        if(getStorytellerInfo(gameState)?.uuid != localStorage.getItem("uuid")){
            navigate("/game")
        }

    }, [lastMessage]);

    return (
        <div className="grid gap-4 grid-cols-2 grid-rows-1 h-full">
            <RoleSelect sendMessage={sendMessage}/>
            <div className="grid gap-4 grid-rows-2 grid-cols-1">
                <LobbyInfo messageHistory={messageHistory} disablePlayerChange={false}/>
                <PlayerList players={gameState.players}/>
            </div>
        </div>
    )


}