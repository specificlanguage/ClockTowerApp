import Block from "./Block.tsx";
import useSWRImmutable from "swr/immutable";
import fetcher from "../http/fetcher.ts";
import {separateRoles} from "../lib/gameCommons/gameAndPlayerUtilities.ts";
import {useState} from "react";
import {Role} from "../lib/types.ts";

interface RoleSelectProps {
    maxPlayers: number
}

interface SelectRoleButtonProps {
    role: Role,
    handleClick: (arg0: Role) => void
    selected: boolean
}

export function SelectRoleButton({role, handleClick, selected}: SelectRoleButtonProps){

    return (
        <button onClick={() => handleClick(role)}>
            {selected ?
                (<div className={"p-4 rounded-2xl bg-blue-400"}>
                    <></>
                    <h6>{role.role_name}</h6>
                </div>)
                :
                <div className={"p-4 rounded-2xl bg-white"}>
                    <></>
                    <h6>{role.role_name}</h6>
                </div>
            }
        </button>
    )
}

export default function RoleSelect ({maxPlayers}: RoleSelectProps) {

    const { data, error, isLoading } = useSWRImmutable('/script?scriptID=trouble_brewing', fetcher)
    const [roles, setRoles] = useState<Role[]>(
        []
    )

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
            if (newRoles.length >= maxPlayers) {
                newRoles = newRoles.slice(-maxPlayers)
            }
        }

        console.log(newRoles)
        setRoles(newRoles)
    }

    const roleList = separateRoles(data);

    return (
    <Block id="roleSelect" className="px-6 bg-neutral-300 overflow-y-auto rounded-none overflow-auto">
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {roleList.townsfolk.map((role) =>
                <SelectRoleButton key={role.role_name} role={role} handleClick={handleButton} selected={roles.includes(role)}/>
            )}
        </div>
        <hr/>
        {roleList.outsiders.map((role) =>
            <SelectRoleButton key={role.role_name} role={role} handleClick={handleButton} selected={roles.includes(role)}/>
        )}
        <hr/>
        {roleList.minions.map((role) =>
            <SelectRoleButton key={role.role_name} role={role} handleClick={handleButton} selected={roles.includes(role)}/>
        )}
        <hr/>
        {roleList.demons.map((role) =>
            <SelectRoleButton key={role.role_name} role={role} handleClick={handleButton} selected={roles.includes(role)}/>
        )}
    </Block>
    )

}