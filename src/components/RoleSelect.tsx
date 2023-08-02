import Block from "./Block.tsx";
import useSWRImmutable from "swr/immutable";
import fetcher from "../http/fetcher.ts";
import {numRole, removeRoleFromList, RoleItems, separateRoles} from "../lib/gameCommons/gameAndPlayerUtilities.ts";
import {useState} from "react";
import {Role, RoleType} from "../lib/types.ts";

interface RoleSelectProps {
    maxPlayers: number
}

interface RoleSelectSectionProps {
    roleList: Role[],
    handleClickFn: (arg0: Role, arg1: boolean) => void
}

export function RoleSelectSection({roleList, handleClickFn}: RoleSelectSectionProps) {
    return (<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 m-2">
        {roleList.map((role) => (
            <button key={role.role_name} className={"border border-black" + (roleList.includes(role) ?? "bg-blue-500")}>
                <div className="p-4 rounded-2xl bg-white"
                        onClick={() => handleClickFn(role, roleList.includes(role))}>
                    <></>
                    <h6>{role.role_name}</h6>
                </div>
            </button>
        ))}
    </div>)
}

export default function RoleSelect ({maxPlayers}: RoleSelectProps) {

    const { data, error, isLoading } = useSWRImmutable('/script?scriptID=trouble_brewing', fetcher)
    const [roles, setRoles] = useState<RoleItems>(
        {demons: [], minions: [], outsiders: [], townsfolk: []}
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

    const roleList = separateRoles(data);

    function handleButton(role: Role, selected: boolean){
        console.log(roles, selected)
        if(selected) addToRolesUsed(role);
        else {
            switch(role.team){
                case RoleType.TOWNSFOLK:
                    if(roles.townsfolk.includes(role)) return
                    setRoles({...roles, townsfolk: removeRoleFromList(roles.townsfolk, role)})
                    return
                case RoleType.OUTSIDER:
                    if(roles.outsiders.includes(role)) return
                    setRoles({...roles, outsiders: removeRoleFromList(roles.outsiders, role)})
                    break
                case RoleType.MINION:
                    if(roles.minions.includes(role)) return
                    setRoles({...roles, minions: removeRoleFromList(roles.minions, role)})
                    break
                case RoleType.DEMON:
                    if(roles.demons.includes(role)) return
                    setRoles({...roles, demons: removeRoleFromList(roles.demons, role)})
                    break
            }
        }
        console.log(roles)
    }

    function addToRolesUsed(role: Role) {
        setRoles((prevState) => {
            return {
                ...prevState,
                ...(role.team == RoleType.TOWNSFOLK && {townsfolk: prevState.townsfolk.concat(role)}),
                ...(role.team == RoleType.OUTSIDER && {outsiders: prevState.outsiders.concat(role)}),
                ...(role.team == RoleType.MINION && {minions: prevState.minions.concat(role)}),
                ...(role.team == RoleType.DEMON && {demons: prevState.demons.concat(role)}),
            }
        });

        if(roles.townsfolk.length > numRole(maxPlayers, RoleType.TOWNSFOLK)){
            console.log("here")
            setRoles({
                ...roles,
                townsfolk: roles.townsfolk.slice(1) ?? [] as Role[]
            })
        } else if(roles.outsiders.length > numRole(maxPlayers, RoleType.OUTSIDER)){
            setRoles({
                ...roles,
                outsiders: roles.outsiders.slice(1) ?? [] as Role[]
            })
        } else if(roles.minions.length > numRole(maxPlayers, RoleType.MINION)){
            setRoles({
                ...roles,
                minions: roles.minions.slice(1) ?? [] as Role[]
            })
        } else if(roles.demons.length > numRole(maxPlayers, RoleType.DEMON)){
            setRoles({
                ...roles,
                demons: roles.demons.slice(1) ?? [] as Role[]
            })
        }
        console.log(roles)
    }


    return (
    <Block id="roleSelect" className="px-6 bg-neutral-300 overflow-y-auto rounded-none overflow-auto">
        <RoleSelectSection roleList={roleList.townsfolk} handleClickFn={handleButton}/>
        <hr/>
        <RoleSelectSection roleList={roleList.outsiders} handleClickFn={handleButton}/>
        <hr/>
        <RoleSelectSection roleList={roleList.minions} handleClickFn={handleButton}/>
        <hr/>
        <RoleSelectSection roleList={roleList.demons} handleClickFn={handleButton}/>
    </Block>
    )

}