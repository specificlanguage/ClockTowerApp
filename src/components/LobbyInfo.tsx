import {GameState} from "../lib/types.ts";
import {useState} from "react";
import {Button, Modal} from "flowbite-react";
import {getStorytellerInfo} from "../lib/gameCommons/gameAndPlayerUtilities.ts";

export interface LobbyInfoProps {
    messageHistory: string[],
    gameState: GameState,
}

export default function LobbyInfo({messageHistory, gameState}: LobbyInfoProps) {

    const [openModal, setOpenModal] = useState(false);

    const storyteller = getStorytellerInfo(gameState)

    return (
        <div className="border border-black rounded-2xl bg-neutral-300 relative">
            <div className="p-4">
                <h2>{gameState.code}</h2>
                <hr className="border border-black"/>
                <h3>Playing script: {gameState.script}</h3>
                <h5>Storyteller: {storyteller?.name ?? "Not found"}</h5>
                <h5 className="mt-5">Join with code: {gameState.code}</h5>
            </div>
            {import.meta.env.VITE_DEBUG &&
                <div className="border border-black rounded-2xl bg-green-50 p-2 absolute bottom-0 mx-auto w-full invisible lg:visible">
                    <h6>Debug messages</h6>
                    <div>
                        <p>Last message received:</p>
                        {messageHistory.length >= 1 && (<p>{messageHistory[messageHistory.length - 1]}</p>)}
                    </div>
                    <Button className="rounded bg-indigo-400 text-white" onClick={() => setOpenModal(true)}>Show message history</Button>
                    <Modal dismissible show={openModal} onClose={() => setOpenModal(false)}>
                        <Modal.Header>Previous Messages</Modal.Header>
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