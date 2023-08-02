import fetcher from "../http/fetcher.ts"
import Block from "./Block.tsx"
import ScriptRoles from "./ScriptRoles.tsx"
import {Spinner} from "flowbite-react";
import {Role} from "../lib/types.ts";
import useSWRImmutable from "swr/immutable";

/**
 * ScriptView - creates a view for players to view the current Script in use.
 * @constructor
 */
export default function ScriptView() {

    const { data, error, isLoading } = useSWRImmutable('/script?scriptID=trouble_brewing', fetcher)

    if(isLoading) {
        return (
            <Block id="script-loading" className="bg-neutral-300">
                <div className="mx-auto">
                    <Spinner aria-label="Loading script..." />
                </div>
            </Block>
        )
    } else if (error || !data) {
        return (
            <Block className="bg-neutral-300" id="script-error">
                <h3 className="m-2 font-lato">Could not load script. Has the storyteller not picked a script yet?</h3>
            </Block>
        )
    }

    const townsfolk: Role[] = [],
        outsiders: Role[] = [],
        minions: Role[] = [],
        demons: Role[] = []

    console.log(data)

    const roles: Role[] = data.roles
    roles.map((role: Role) => {
        switch (role.team){
            case 0:
                townsfolk.push(role)
                break
            case 1:
                outsiders.push(role)
                break
            case 2:
                minions.push(role)
                break
            case 3:
                demons.push(role)
                break
        }
    })


    return (
        <Block id="sidebar" className="px-6 bg-neutral-300 overflow-y-auto rounded-none">
            <h2 className="mt-4 text-3xl">Trouble Brewing</h2>
            <hr className="border-black"/>
            <div className={"italic font-lato"} >
                Clouds roll in over Ravenswood Bluff, engulfing this sleepy town and its superstitious inhabitants in foreboding shadow. Freshly-washed clothes dance eerily on lines strung between cottages. Chimneys cough plumes of smoke into the air. Exotic scents waft through cracks in windows and under doors, as hidden cauldrons lay bubbling. An unusually warm Autumn breeze wraps around vine-covered walls and whispers ominously to those brave enough to walk the cobbled streets.
                <br className="mb-1"/>
                Anxious mothers call their children home from play, as thunder begins to clap on the horizon. If you listen more closely, however, noises stranger still can be heard echoing from the neighbouring forest. Under the watchful eye of a looming monastery, silhouetted figures skip from doorway to doorway.
                <br className="mb-1"/>
                Those who can read the signs know there is...
                <p className="inline italic font-bold">Trouble Brewing.</p>
            </div>

            <hr className="border-black"/>

            {/*  Townsfolk */}
            <ScriptRoles id={"townsfolk"} heading={"Townsfolk"} roles={townsfolk} color={"bg-sky-400"}/>
            <hr className="border-black"/>
            {/* Outsiders */}
            <ScriptRoles id={"outsiders"} heading={"Outsiders"} roles={outsiders} color={"bg-sky-400"}/>
            <hr className="border-black"/>
            {/* Minions */}
            <ScriptRoles id={"minions"} heading={"Minions"} roles={minions} color={"bg-red-400"}/>
            <hr className="border-black"/>
            {/* Demons */}
            <ScriptRoles id={"demons"} heading={"Demons"} roles={demons} color={"bg-red-400"}/>
            <div className="mb-4"/>
        </Block>
    )
}