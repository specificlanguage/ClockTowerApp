import {PlayerListProps} from "../lib/types";
import PlayerIcon from "./PlayerIcon";
import Block from "./Block";

import Default from "../assets/default.jpg";

/**
 * Displays a list of players that are currently in the lobby, given a list of players.
 * @param players
 * @constructor
 */
export default function PlayerList ({players}: PlayerListProps) {

    return (
        <Block id="sidebar" className="bg-neutral-300 overflow-auto rounded-none">
            {/*<div id="playerlist-header" className="mb-2">*/}
            {/*    <h2 className="inline-block">Players</h2>*/}
            {/*    <h5 className="ml-2 text-xl inline-block"> ({players.length} / 15)</h5>*/}
            {/*</div>*/}
            <div id="playerlist" className="space-y-2 border border-neutral-500 rounded-2xl bg-amber-100 overflow-auto">
                {players.map((player) => {
                    return (
                        <div key={player.name} className="m-2 p-2 border border-black rounded-2xl mx-2 bg-neutral-50 h-[80px]">
                            <div className="float-left align-middle">
                                <PlayerIcon name={player.name} key={player.name} imageURL={player.imageURL ?? Default} size={60}/>
                            </div>
                            <div className="align-baseline">
                                <h3 className="text-2xl ml-4 inline-block">{player.name}</h3>
                            </div>
                        </div>)
                })}
            </div>
        </Block>
    )
}