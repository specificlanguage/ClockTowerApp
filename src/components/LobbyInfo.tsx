import {GameState} from "../lib/types.ts";
import {useState} from "react";
import {Button, Label, Modal, Select} from "flowbite-react";
import {getStorytellerInfo} from "../lib/gameCommons/gameAndPlayerUtilities.ts";
import {range} from "flowbite-react/lib/esm/helpers/range";

export interface LobbyInfoProps {
    messageHistory: string[],
    gameState: GameState,
}

export default function LobbyInfo({messageHistory, gameState}: LobbyInfoProps) {

    const [openModal, setOpenModal] = useState(false);
    const [numPlayers, setNumPlayers] = useState(16);

    const storyteller = getStorytellerInfo(gameState)

    function numPlayerChange (event: { target: { value: string; }; }) {
        setNumPlayers(parseInt(event.target.value))
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
                    <Select id="numplayers" className="w-24" value={numPlayers} onChange={numPlayerChange}>
                        {range(5, 16).map((n) => (
                            <option value={n}>{n}</option>
                        ))}
                    </Select>
                </div>
            </div>
            {import.meta.env.VITE_DEBUG &&
                <div className="border border-black rounded-2xl bg-green-50 p-2 absolute bottom-0 w-full invisible lg:visible">
                    <h6>Debug messages</h6>
                    <div>
                        <p>Last message received:</p>
                        {messageHistory.length >= 1 && (<p>{messageHistory[messageHistory.length - 1]}</p>)}
                    </div>
                    <Button className="rounded bg-indigo-400 text-white" onClick={() => setOpenModal(true)}>Show message history</Button>
                    <Modal dismissible show={openModal} onClose={() => setOpenModal(false)}>
                        <Modal.Header className="font-lato">Previous Messages</Modal.Header>
                        <Modal.Body className="overflow-auto">
                            <ul className="list-none">
                                {messageHistory.map((msg) => (
                                    <li>{msg}</li>
                                ))}
                            </ul>
                        </Modal.Body>
                    </Modal>
                </div>
            }
        </div>
    )
}