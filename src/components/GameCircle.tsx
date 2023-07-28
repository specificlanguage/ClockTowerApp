'use client' // It's required for this set of things

import {GameCircleProps} from "../lib/types.ts"
import PlayerIcon from "./PlayerIcon.tsx";
import {useState, useEffect} from "react";

export default function GameCircle({ players }: GameCircleProps) {

    const MAX_DIAM = 900; // For ease of use
    const [radius, setRadius] = useState(450);
    const angle = 360 / players.length

    function calculateTransform(itemNum: number) {
        const yTransform = (Math.sin((angle * itemNum) * Math.PI / 180) * radius + radius * 0.9)
        const xTransform = (Math.cos((angle * itemNum) * Math.PI / 180) * radius + radius * 0.9)
        return {
            x: xTransform.toLocaleString(undefined, {maximumFractionDigits: 0}),
            y: yTransform.toLocaleString(undefined, {maximumFractionDigits: 0})
        }
    }

    const translate = (itemNum: number)  => {
        const {x, y} = calculateTransform(itemNum)
        return {transform: `translateX(${x}px) translateY(${y}px)`}
    }

    const circleSize = (radius: number) => {
        return {
            width: radius * 2,
            height: radius * 2,
        }
    }

    useEffect(() => {

        function handleResize() {
            if(window.innerWidth - 100 < MAX_DIAM) {
                // TODO: possibly make warning to say that the window needs to be bigger!
                setRadius((window.innerWidth - 100) / 2);
            } else {
                setRadius(450);
            }
        }

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);

    }, [radius]);


    return (
        <div id="main-circle" className="m-auto" style={circleSize(radius)}>
            {players.map((player, i) => {
                return (
                    <div className={"absolute w-[100px] h-[100px] border-black border-[1px] bg-white rounded-full"}
                         style = {translate(i)} key={i}>
                        <PlayerIcon name={player.name} imageURL={player.imageURL ?? undefined}/>
                    </div>
                )
            })}
        </div>

    )
}