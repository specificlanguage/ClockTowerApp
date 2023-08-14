import {WebsocketMessage} from "../lib/types.ts";
import {useState} from "react";
import {Button, Label, Modal, Select} from "flowbite-react";
import {getStorytellerInfo} from "../lib/gameCommons/gameAndPlayerUtilities.ts";
import {range} from "flowbite-react/lib/esm/helpers/range";
import {useAtom} from "jotai";
import {gameStateAtom} from "../stores/atom.ts";

export interface LobbyInfoProps {
    messageHistory: WebsocketMessage[]
    disablePlayerChange: boolean
}

export default function LobbyInfo({messageHistory, disablePlayerChange}: LobbyInfoProps) {

    const [gameState, setGameState] = useAtom(gameStateAtom);
    const [openModal, setOpenModal] = useState(false);
    const [numPlayers, setNumPlayers] = useState(gameState.maxPlayers);

    const storyteller = getStorytellerInfo(gameState)

    function numPlayerChange (event: { target: { value: string; }; }) {
        setNumPlayers(parseInt(event.target.value))
        setGameState({...gameState, maxPlayers: parseInt(event.target.value)})
    }

    return (
        <div className="border border-black rounded-2xl bg-neutral-300 relative">
            <div className="p-4">
                <h2>{gameState.code}</h2>
                <hr className="border border-black"/>
                <h3>Playing script: {gameState.script}</h3>
                <h5>Storyteller: {storyteller?.name ?? "Not found"}</h5>
                <h5 className="mt-5">Join with code: {gameState.code}</h5>
                <div className="mt-2">
                    <Label htmlFor="numPlayers" value="Number of Players"/>
                    <Select id="numplayers" className="w-20" value={numPlayers} onChange={numPlayerChange} disabled={disablePlayerChange}>
                        {range(Math.max(gameState.players.length, 5), 16).map((n) => (
                            <option value={n}>{n}</option>
                        ))}
                    </Select>
                </div>
            </div>
            {/*Debug info below. Could be extracted into its own component.*/}
            {import.meta.env.VITE_DEBUG &&
                <div className="border border-black rounded-2xl bg-green-50 p-2 absolute bottom-0 w-full invisible lg:visible">
                    <h6>Debug messages</h6>
                    <div>
                        <p>Last message received:</p>
                        {messageHistory.length >= 1 && (<p className="py-2">Received @ {messageHistory[messageHistory.length-1].time.toLocaleTimeString()} <br/> {messageHistory[messageHistory.length-1].type}</p>)}
                    </div>
                    <Button className="rounded bg-indigo-400 text-white" onClick={() => setOpenModal(true)}>Show message history</Button>
                    <Modal dismissible show={openModal} onClose={() => setOpenModal(false)}>
                        <Modal.Header className="font-lato py-2 px-5">Previous Messages</Modal.Header>
                        <Modal.Body className="overflow-auto p-0">
                            <ul className="list-none">
                                {messageHistory.map((msg) => (
                                    <li key={msg.time.toLocaleTimeString()}>
                                        <h5>{msg.type} - {msg.time.toLocaleTimeString()}</h5>
                                        <p>{JSON.stringify(msg.message)}</p>
                                    </li>
                                ))}
                            </ul>
                        </Modal.Body>
                    </Modal>
                </div>
            }
        </div>
    )
}