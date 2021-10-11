import React from "react";
import { Vec2 } from "../utils/vec2";
import { Cursor } from "./cursor";
import { MenuComponentProps } from "./menuComponent";
import { Ring } from "./ring";

export class RootMenu extends React.Component<{}, {
    info: MenuComponentProps;
    // elements: JSX.Element[];
    elementCount: number;
}> {
    constructor(props: {}) {
        super(props);
        let eleCount = 8;
        this.state = {
            elementCount: eleCount,
            info: {
                rotationOffset: -90+180/eleCount,
                cursorRotation: 0,
                cursorSize: 360/eleCount,
                innerRadius: 30,
                outerRadius: 50,
                ringWidth: 20,
                width: 100,
                height: 100,
                center: new Vec2(50, 50),
            }
        }
    }

    componentDidMount() {
        setInterval(() => {
            this.setState(state => {
                let info = state.info;
                info.cursorRotation += 1;
                return {info: info};
            })
        }, 1000/60);
    }

    render() {
        return (
            <svg className="root-menu" viewBox="0 0 100 100">
                <Ring info={this.state.info} color={{fill: "grey"}}/>
                <Cursor info={this.state.info} color={{fill: "black"}}/>
            </svg>
        );
    }
}