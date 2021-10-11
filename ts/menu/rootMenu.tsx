import React from "react";
import { mod } from "../utils/mathUtils";
import { Vec2 } from "../utils/vec2";
import { Cursor } from "./cursor";
import { ItemMenu } from "./items/itemMenu";
import { ItemComponentProps } from "./menuComponent";
import { Ring } from "./ring";

export class RootMenu extends React.Component<{}, {
    info: ItemComponentProps;
    // elements: JSX.Element[];
    elementCount: number;
}> {
    constructor(props: {}) {
        super(props);
        let eleCount = 8;
        this.state = {
            elementCount: eleCount,
            info: {
                rotationOffset: 0,
                cursorRotation: 0,
                cursorSize: 360 / eleCount,
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
            let x = new Date().getTime();
            let w = 12000;
            let h = 360
            let o = 6000;
            let r = 2 * h / w
            let e = Math.abs(r * (x - o) - 2 * h * Math.floor(r * (x - o) / (2 * h)) - h);
            this.setState(state => {
                let info = state.info;
                info.cursorRotation = e;
                return { info: info };
            })
        }, 1000 / 60);
    }

    render() {
        return (
            <svg className="root-menu" viewBox="0 0 100 100">
                <Ring info={this.state.info} color={{ fill: "grey" }} />
                <Cursor info={this.state.info} color={{ fill: "black" }} />
            </svg>
        );
    }
}