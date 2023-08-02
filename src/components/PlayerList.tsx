import {PlayerListProps} from "../lib/types";
import PlayerIcon from "./PlayerIcon";

import Default from "../assets/default.jpg";

/**
 * Displays a list of players that are currently in the lobby, given a list of players.
 * @param players
 * @constructor
 */
export default function PlayerList ({players}: PlayerListProps) {

    return (
        <div id="playerlist" className="space-y-2 p-4 border border-neutral-500 rounded-2xl bg-amber-100">
            <h3 className="px-5">
                Players ({players.length}/16)
            </h3>
            <div className="overflow-auto">
            {players.map((player) => {
                return (
                    <div key={player.name} className="m-2 p-2 border border-black rounded-2xl mx-2 bg-neutral-50 h-[80px]">
                        <div className="float-left align-middle">
                            <PlayerIcon name={player.name} key={player.name} imageURL={player.imageURL ?? Default} size={60}/>
                        </div>
                        <div className="ml-4 inline-block">
                            <h3>{player.name}</h3>
                            {player.isStoryteller && <h4 className="block pb-2 text-yellow-500">Storyteller</h4>}
                        </div>
                    </div>)
            })}
            </div>
        </div>
    )
}