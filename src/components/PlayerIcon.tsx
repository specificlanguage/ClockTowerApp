'use client';

import {PlayerIconProps} from "../lib/types";

export default function PlayerIcon ({name, imageURL, size}: PlayerIconProps) {

    // TODO: assign random funny bird
    // if(imageURL == null || undefined) {
    //
    // }


    // TODO: don't allow click if not waiting for interaction...

    return (
        <div>
            <button onClick={() => console.log("hello")}>
                <img
                    src={imageURL ?? "/default.jpg"}
                    width={size ?? 100}
                    height={size ?? 100}
                    alt={name}
                    className="rounded-full border-black border-2"
                />
            </button>
        </div>
    )
}