import {Button, Card, Label, Select, Spinner, Tabs, TextInput} from "flowbite-react";
import {FaPlus, FaUser} from "react-icons/fa";
import {FormEvent, useState} from "react";
import fetcher from "../http/fetcher";
import {gameCodeAtom, nameAtom} from "../stores/atom.ts";
import {useSetAtom} from "jotai";
import {useNavigate} from "react-router-dom";


export default function JoinMenu () {

    return (
        <div className="w-96 rounded-full">
            <Tabs.Group aria-label="Default tabs" style="fullWidth" className="">
                <Tabs.Item active icon={FaUser} title={"Join Game"} >
                    <Card className="bg-neutral-400 h-1/3 border border-black">
                        <JoinGameForm/>
                    </Card>
                </Tabs.Item>
                <Tabs.Item icon={FaPlus} title={"Create Game"}>
                    <Card className="bg-neutral-400 h-1/3 border border-black">
                        <CreateGameForm/>
                    </Card>
                </Tabs.Item>
            </Tabs.Group>
        </div>
    )
}

function JoinGameForm () {

    const [loading, setLoading] = useState(false);
    const [name, setName] = useState("");
    const [code, setCode] = useState("");

    const navigate = useNavigate()

    const setNameAtom = useSetAtom(nameAtom);
    const setCodeAtom = useSetAtom(gameCodeAtom);

    function joinGame (event: Event) {
        event.preventDefault();
        setLoading(true);
        // console.log(name, code);
        setNameAtom(name)
        setCodeAtom(code)

        // TODO: Check endpoint to see if you can connect to the game.
        // Possibly could be cool to add a verifier here.

        navigate("/game/")
    }

    return (
        <form className="flex flex-col gap-4">
            <div className="block">
                <Label htmlFor="gameCode" value="Game Code"/>
                <TextInput id="gameCode" placeholder="XXXXXX" required type="text"
                           value={code} onChange={e => setCode(e.target.value)}/>
            </div>
            <div className="block">
                <Label htmlFor="name" value="Name"/>
                <TextInput id="name" placeholder={"Your name here"} required type="text"
                           value={name} onChange={e => setName(e.target.value)}/>
            </div>
            <div className="flex justify-center">
                <Button type="submit" className="bg-blue-600 hover:bg-blue-500" onClick={joinGame}>
                    {loading ? <Spinner/> : <>Join Game</>}
                </Button>
            </div>
        </form>
    )
}

function CreateGameForm() {

    const [loading, setLoading] = useState(false);
    const [name, setName] = useState("");
    const [error, setError] = useState("");

    const setNameAtom = useSetAtom(nameAtom);
    const setCodeAtom = useSetAtom(gameCodeAtom);

    const navigate = useNavigate()

    function createGame(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setLoading(true)
        fetcher("/game/create", {
            method: "POST",
            body: JSON.stringify({scriptID: "trouble_brewing"})
        }).then(async (r) => {
            setCodeAtom(r.code)
            setNameAtom(name)
            navigate("/storyteller")
        }).catch(() => {
            setLoading(false);
            setError("An error occurred when creating a game, try again later.")
        })
    }

    return (
        <form className="flex flex-col gap-4" onSubmit={createGame}>
            <div className="block">
                <Label htmlFor="script" value="Script"/>
                <Select id={"script"} disabled className="mt-2">
                    <option>
                        Trouble Brewing
                    </option>
                    <option>
                        Sects and Violets
                    </option>
                    <option>
                        Bad Moon Rising
                    </option>
                </Select>
            </div>
            <div className="block">
                <Label htmlFor="name" value="Name"/>
                <TextInput id="name" placeholder={"Your name here"} required type="text"
                           value={name} onChange={e => setName(e.target.value)}/>
            </div>
            {error != "" && <p className="px-10 my-1 text-red-700 font-lato">
                {error}
            </p>}
            <div className="flex justify-center">
                <Button type="submit" className="bg-green-700 hover:bg-green-500" onClick={createGame}>
                    {loading ? <Spinner/> : <>Create Game</>}
                </Button>
            </div>
        </form>
    )

}