import React from "react";
import { mod } from "../utils/mathUtils";
import { Vec2 } from "../utils/vec2";
import { Cursor } from "./cursor";
import { ItemMenu } from "./items/itemMenu";
import { defaultOptions, generateComponents, generateProps, InfoComponentProps, Item, Menu } from "./menuComponent";
import { Ring } from "./ring";

export class RootMenu extends React.Component<{}, {
    info: InfoComponentProps;
    // elements: JSX.Element[];
    root: JSX.Element;
}> {
    constructor(props: {}) {
        super(props);
        let info: InfoComponentProps = generateProps(defaultOptions, 100, 100, (defaultOptions.rootMenu.items as Item[])[5] as Menu);
        console.log(info);
        this.state = {
            info: info,
            root: generateComponents(defaultOptions.rootMenu, info)
        }
    }

    componentDidMount() {
        /* setInterval(() => {
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
        }, 1000 / 60); */
    }

    render() {
        return (
            <svg className="root-menu" viewBox="0 0 100 100">
                <Ring info={this.state.info} color={{ fill: "#cccccf" }} />
                <Cursor info={this.state.info} color={{ fill: "#0ae" }} />
                {/* 
                 */}
                {this.state.root}
            </svg>
        );
    }
}