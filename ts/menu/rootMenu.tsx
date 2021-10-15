import React from "react";
import { mod, rotDiff, clamp, approx, toDeg } from "../utils/mathUtils";
import { Vec2 } from "../utils/vec2";
import { Cursor } from "./cursor";
import { ItemMenu } from "./items/itemMenu";
import { CursorComponentProps, defaultOptions, generateComponents, generateProps, InfoComponentProps, Item, Menu } from "./menuComponent";
import { Ring } from "./ring";

export class RootMenu extends React.Component<{}, {
    info: InfoComponentProps;
    // elements: JSX.Element[];
    root: JSX.Element;
    cursor: CursorComponentProps;
    // currentItem: Item;
    // currentMenu: Menu;
    // currentMenuIndex: number;
    svg: SVGSVGElement;
}> {
    constructor(props: {}) {
        super(props);
        let info: InfoComponentProps = generateProps(defaultOptions, 100, 100, (defaultOptions.rootMenu.items as Item[])[5] as Menu);

        this.state = {
            info: info,
            root: generateComponents(defaultOptions.rootMenu, info),
            cursor: {
                cursorRotation: 0,
                cursorSize: info.itemAngleSize,
                cursorColor: { fill: "#0ae" },
            },
            svg: null,
        }

        this.setCursor = this.setCursor.bind(this);
    }

    componentDidMount() {
        this.setState({
            svg: document.getElementById("root-menu") as unknown as SVGSVGElement,
        });
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
        // const self = this;
        // let i = 0;
        // let add = 1;
        // setInterval(() => {
        //     i += add;
        //     i = mod(i, 6);
        //     // if (i >= 5) {
        //     //     add = -1;
        //     // } else if (i <= 0) {
        //     //     add = 1;
        //     // }
        //     self.setCursor({
        //         cursorRotation: 360 / 6 * i,
        //         cursorSize: this.state.info.itemAngleSize,
        //         cursorColor: { fill: "#0ae" },
        //     });
        // }, 1000);
    }

    render() {
        return (
            <svg id="root-menu" viewBox="0 0 100 100">
                <Ring info={this.state.info} color={{ fill: "#cccccf" }} onMouseMove={this.onMouseMove.bind(this)} />
                <Cursor info={this.state.info} cursorInfo={this.state.cursor} />
                {/* 
                 */}
                {this.state.root}
            </svg>
        );
    }

    onMouseMove(e: React.MouseEvent<SVGPathElement, MouseEvent>) {
        const { clientX, clientY } = e;
        const { info } = this.state;
        const { itemAngleSize, rotationOffset, } = info;
        const { x, y } = this.getCenterOfPage();
        const angle = mod(toDeg(Math.atan2(clientY - y, clientX - x)) + rotationOffset, 360);
        const index = this.indexFromAngle(angle);
        this.setCursor({
            cursorRotation: index * itemAngleSize,
            cursorSize: itemAngleSize,
            cursorColor: { fill: "#0ae" },
        });
    }

    setCursor(cursor: CursorComponentProps) {
        this.setState(state => {
            return {
                cursor: cursor
            }
        });
        // this.animateCursor();
    }

    getCenterOfPage() {
        const { svg } = this.state;
        const { clientWidth, clientHeight } = svg;
        return new Vec2(clientWidth / 2, clientHeight / 2);
    }

    indexFromAngle(angle: number) {
        const { info } = this.state;
        const { itemAngleSize, rotationOffset, } = info;
        return Math.round((angle - rotationOffset) / itemAngleSize) + 1;
    }
}