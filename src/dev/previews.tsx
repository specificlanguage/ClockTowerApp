import React from "react";
import {ComponentPreview, Previews} from "@react-buddy/ide-toolbox";
import {PaletteTree} from "./palette";
import JoinMenu from "../components/JoinMenu.tsx";

const ComponentPreviews = () => {
    return (
        <Previews palette={<PaletteTree/>}>
            <ComponentPreview path="/JoinMenu">
                <JoinMenu/>
            </ComponentPreview>
        </Previews>
    );
};

export default ComponentPreviews;