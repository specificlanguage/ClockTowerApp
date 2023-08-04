import Block from "./Block.tsx";
import useSWRImmutable from "swr/immutable";
import fetcher from "../http/fetcher.ts";
import {numRole, separateRoles} from "../lib/gameCommons/gameAndPlayerUtilities.ts";
import {useEffect, useState} from "react";
import {Role, RoleType} from "../lib/types.ts";
import {useAtom} from "jotai";
import {gameStateAtom} from "../stores/atom.ts";

interface SelectRoleButtonProps {
    role: Role,
    handleClick: (arg0: Role) => void
    selected: boolean
    className?: string
    classNameSelected?: string
}

export function SelectRoleButton({role, handleClick, selected, className, classNameSelected}: SelectRoleButtonProps){

    return (
        <button onClick={() => handleClick(role)}>
            {selected ?
                (<div className={"align-middle p-1 h-12 lg:h-36 rounded-2xl hover:scale-105 ease-in-out delay-100 duration-300 " + classNameSelected ?? ""}>
                    <></>
                    <h6>{role.role_name}</h6>
                    <p className="text-sm visible max-lg:hidden">{role.description}</p>
                </div>)
                :
                <div className={"align-middle p-1 h-12 lg:h-36 rounded-2xl bg-white hover:bg-neutral-200 hover:scale-105 ease-in-out delay-100 duration-300 " + className ?? ""}>
                    <></>
                    <h6>{role.role_name}</h6>
                    <p className="text-sm visible max-lg:hidden ">{role.description}</p>
                </div>
            }
        </button>
    )
}

export default function RoleSelect () {

    const { data, error, isLoading } = useSWRImmutable('/script?scriptID=trouble_brewing', fetcher)
    const [roles, setRoles] = useState<Role[]>(
        []
    )
    const [gameState] = useAtom(gameStateAtom);

    useEffect(() => {
        let newRoles = roles;
        newRoles = newRoles.slice(0, gameState.maxPlayers);
        setRoles(newRoles)
    }, [gameState]);

    if(isLoading){
        return (
            <Block id="roleSelectLoading" className="px-6 bg-neutral-300 overflow-y-auto rounded-none">
                <h3 className="font-lato align-middle my-auto">Loading script...</h3>
            </Block>
        )
    } else if (error || !data) {
        return (
            <Block className="bg-neutral-300" id="script-error">
                <h3 className="font-lato align-middle my-auto">Could not load script. Is the server down?</h3>
            </Block>
        )
    }

    function handleButton(role: Role) {
        let newRoles = roles;

        const addedItem = roles.find((r) => role.role_name == r.role_name);
        if(addedItem) { // If item in the list
            // Filter out the item that isn't the role
            newRoles = newRoles.filter((r) => r.role_name !== role.role_name);
        } else {
            newRoles = newRoles.concat(role)
            if (newRoles.length >= gameState.maxPlayers) {
                newRoles = newRoles.slice(-gameState.maxPlayers)
            }
        }
        setRoles(newRoles)
    }

    const roleList = separateRoles(data);

    return (
    <Block id="roleSelect" className="px-6 bg-neutral-300 overflow-y-auto rounded-none overflow-auto">
        <h2 className="mt-4 text-3xl">Trouble Brewing</h2>
        <hr className="border border-black"/>
        <h4>Welcome, Storyteller, to Ravenswood Bluff!</h4>
        <p className="font-normal">Select roles to play with (roll over for description)</p>
        <hr className="border border-black"/>
        <h3 className="mb-2">Townsfolk ({roles.filter(r => r.team == RoleType.TOWNSFOLK).length}/{numRole(gameState.maxPlayers, RoleType.TOWNSFOLK)})
        </h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-2 mb-4">
            {roleList.townsfolk.map((role) =>
                <SelectRoleButton key={role.role_name} role={role} handleClick={handleButton} selected={roles.includes(role)} classNameSelected={"bg-blue-400"}/>
            )}
        </div>
        <hr className="border border-black"/>
        <h3 className="mb-2">Outsiders ({roles.filter(r => r.team == RoleType.OUTSIDER).length}/{numRole(gameState.maxPlayers, RoleType.OUTSIDER)})</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-2 mb-4">
            {roleList.outsiders.map((role) =>
            <SelectRoleButton key={role.role_name} role={role} handleClick={handleButton} selected={roles.includes(role)} classNameSelected={"bg-blue-400"}/>
            )}
        </div>
        <hr className="border border-black"/>
        <h3 className="mb-2">Minions ({roles.filter(r => r.team == RoleType.MINION).length}/{numRole(gameState.maxPlayers, RoleType.MINION)})</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-2 mb-4">
            {roleList.minions.map((role) =>
                <SelectRoleButton key={role.role_name} role={role} handleClick={handleButton} selected={roles.includes(role)} classNameSelected={"bg-red-400"}/>
            )}
        </div>
        <hr className="border border-black"/>
        <h3 className="mb-2">Demons ({roles.filter(r => r.team == RoleType.DEMON).length}/{numRole(gameState.maxPlayers, RoleType.DEMON)})</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-2 mb-4">
            {roleList.demons.map((role) =>
                <SelectRoleButton key={role.role_name} role={role} handleClick={handleButton} selected={roles.includes(role)} classNameSelected={"bg-red-400"}/>
            )}
        </div>
    </Block>
    )

}