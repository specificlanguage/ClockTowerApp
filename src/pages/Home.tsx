import {useEffect} from 'react'
import '../App.css'
import JoinMenu from "../components/JoinMenu.tsx";

export default function Home() {

    // Please note this is generally insecure, we don't need an account system right now
    // and just need to check for unique clients.
    useEffect(() => {
        // Create unique user on first entry to website
        if(localStorage.getItem("uuid") == undefined) {
            const UUID = crypto.randomUUID()
            localStorage.setItem("uuid", UUID);
        }
    });

    return (
        <div className="h-screen min-w-3xl font-caudex">
            <div className="flex justify-between">
                <h1 className="mx-auto text-4xl font-bold">Blood on the Clock Tower</h1>
            </div>
            <div className="flex justify-between">
                <strong className="mx-auto text-xl font-bold ">By Ezra Newman & Michael Yue</strong>
            </div>
            <div className="mt-6 flex justify-center">
                <JoinMenu/>
            </div>
        </div>
    )
}
