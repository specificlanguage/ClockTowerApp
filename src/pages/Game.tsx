import {useAtom} from "jotai";
import {gameCodeAtom, nameAtom} from "../stores/atom.ts";
import ScriptView from "../components/ScriptView.tsx";
import {useEffect, useState} from "react";
import useWebSocket from "react-use-websocket";

export default function Game () {

    const [gameID] = useAtom(gameCodeAtom);
    const [name] = useAtom(nameAtom);
    const [messageHistory, setMessageHistory] = useState([])
    const socketURL =`${import.meta.env.VITE_WEBSOCKET_URL}/game/${gameID}?name=${name}&uuid=${localStorage.getItem("uuid")}`

    const {lastMessage, } = useWebSocket(socketURL)

    useEffect(() => {
        if(lastMessage !== null){
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            setMessageHistory((prev: never[]) => prev.concat(lastMessage))
        }
    }, [lastMessage]);

    return (
        <div className="grid gap-1 grid-cols-2 grid-rows-1">
            <ScriptView/>
            <div className="w-1/2 bg-white">
                <ul>
                    {messageHistory.map((message, idx) => (
                        <li key={idx}>{message ? message["data"] : null}</li>
                    ))}
                </ul>
            </div>
        </div>
    )


}