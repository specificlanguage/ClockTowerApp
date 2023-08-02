import {useAtom} from "jotai";
import {gameCodeAtom, nameAtom} from "../stores/atom.ts";
import ScriptView from "../components/ScriptView.tsx";
import {useEffect, useState} from "react";
import useWebSocket from "react-use-websocket";
import PlayerList from "../components/PlayerList.tsx";
import {GamePhase, MessageType} from "../lib/gameConsts.ts";
import {getAndAddPlayer, removePlayer, updatePlayers} from "../lib/gameCommons/messageHandle.ts";
import {GameState} from "../lib/types.ts";
import LobbyInfo from "../components/LobbyInfo.tsx";
import {useNavigate} from "react-router-dom";


export default function Storyteller () {

    const [gameID] = useAtom(gameCodeAtom);
    const [name] = useAtom(nameAtom);
    const SOCKET_URL =`${import.meta.env.VITE_WEBSOCKET_URL}/game/${gameID}?name=${name}&uuid=${localStorage.getItem("uuid")}`


    const [gameState, setGameState] = useState<GameState>({
        phase: GamePhase.LOADING,
        players: [],
        code: gameID,
        script: "Trouble Brewing"
    });
    const [loaded, setLoaded] = useState(false);
    const [messageHistory, setMessageHistory] = useState<string[]>([]);

    const {lastMessage, } = useWebSocket(SOCKET_URL);

    const navigate = useNavigate();

    useEffect(() => {

        if(gameID == "" || name == "" || localStorage.getItem("uuid") == null){
            navigate("/")
        }

        if(!loaded) {
            setLoaded(true);
            setGameState({
                ...gameState,
                phase: GamePhase.GAME_LOBBY
            })
        }

        if(lastMessage !== null){
            const parsedMsg = JSON.parse(lastMessage.data);
            setMessageHistory((prevState) => prevState.concat(lastMessage.data))
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
    }, [gameID, gameState, lastMessage, loaded, name, navigate]);

    return (
        <div className="grid gap-4 grid-cols-2 grid-rows-1 h-full">
            <ScriptView/>
            <div className="grid gap-4 grid-rows-2 grid-cols-1">
                <LobbyInfo messageHistory={messageHistory} gameState={gameState}/>
                <PlayerList players={gameState.players}/>
            </div>
        </div>
    )


}