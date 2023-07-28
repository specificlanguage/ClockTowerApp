import {Role} from "../lib/types.ts";

export default function ScriptRoles(props: {
    id: string, heading: string, roles: Role[], color: string, }) {
    return <div id={props.id}>
        <div id={props.id + "-header"}>
            <h3 className="text-2xl mb-2">{props.heading}</h3>
        </div>
        <div id={props.id + "-roles"} className="columns-2">
            {props.roles.map((r) => {return (
                <div key={r.role_name} className="border border-neutral-500 p-1 h-fit mb-2 break-inside-avoid" >
                    <h4 className={"font-bold px-2 py-1 text-lg rounded-lg " + props.color}>{r.role_name}</h4>
                    <p className={"text-base ml-2 font-lato"}>{r.description}</p>
                </div>
            )})}
        </div>
    </div>;
}