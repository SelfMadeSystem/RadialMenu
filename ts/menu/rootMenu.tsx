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
                cursorScale: 1,
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
        const self = this;
        setInterval(() => {
            this.setCursor({
                cursorRotation: this.state.cursor.cursorRotation,
                cursorSize: this.state.cursor.cursorSize,
                cursorColor: { fill: this.state.cursor.cursorColor.fill },
                cursorScale: mod((this.state.cursor.cursorScale - 0.6) - 0.1, 0.5) + 0.6,
            });
        }, 1000);
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
        const { offsetX, offsetY } = e.nativeEvent;
        const { info } = this.state;
        const { itemAngleSize, rotationOffset, } = info;
        const { x, y } = this.getCenterOfPage();
        const angle = mod(toDeg(Math.atan2(offsetY - y, offsetX - x)) + rotationOffset, 360);
        const index = this.indexFromAngle(angle);
        this.setCursor({
            cursorRotation: index * itemAngleSize,
            cursorSize: this.state.cursor.cursorSize,
            cursorColor: { fill: this.state.cursor.cursorColor.fill },
            cursorScale: this.state.cursor.cursorScale,
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