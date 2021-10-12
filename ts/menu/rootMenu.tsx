import React from "react";
import { mod, rotDiff, clamp, approx } from "../utils/mathUtils";
import { Vec2 } from "../utils/vec2";
import { Cursor } from "./cursor";
import { ItemMenu } from "./items/itemMenu";
import { CursorComponentProps, defaultOptions, generateComponents, generateProps, InfoComponentProps, Item, Menu } from "./menuComponent";
import { Ring } from "./ring";

export class RootMenu extends React.Component<{}, {
    info: InfoComponentProps;
    // elements: JSX.Element[];
    root: JSX.Element;
    currentCursor: CursorComponentProps;
    toCursor: CursorComponentProps;
}> {
    constructor(props: {}) {
        super(props);
        let info: InfoComponentProps = generateProps(defaultOptions, 100, 100, (defaultOptions.rootMenu.items as Item[])[5] as Menu);

        this.state = {
            info: info,
            root: generateComponents(defaultOptions.rootMenu, info),
            currentCursor: {
                cursorRotation: 0,
                cursorSize: info.itemAngleSize,
                cursorColor: { fill: "#0ae" },
            },
            toCursor: {
                cursorRotation: 0,
                cursorSize: info.itemAngleSize,
                cursorColor: { fill: "#0ae" },
            }
        }

        this.setCursor = this.setCursor.bind(this);
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
        const self = this;
        let i = 0;
        let add = 1;
        setInterval(() => {
            i += add;
            i = mod(i, 6);
            // if (i >= 5) {
            //     add = -1;
            // } else if (i <= 0) {
            //     add = 1;
            // }
            self.setCursor({
                cursorRotation: 360 / 6 * i,
                cursorSize: this.state.info.itemAngleSize,
                cursorColor: { fill: "#0ae" },
            });
        }, 1000);
    }

    render() {
        return (
            <svg className="root-menu" viewBox="0 0 100 100">
                <Ring info={this.state.info} color={{ fill: "#cccccf" }} />
                <Cursor info={this.state.info} cursorInfo={this.state.currentCursor} />
                {/* 
                 */}
                {this.state.root}
            </svg>
        );
    }

    setCursor(cursor: CursorComponentProps) {
        this.setState(state => {
            return {
                toCursor: cursor
            }
        });
        this.animateCursor();
    }

    _id: number | NodeJS.Timer;

    animateCursor() {
        if (this._id) clearInterval(this._id as NodeJS.Timer);
        this._id = setInterval(() => {
            this.setState(state => {
                const { currentCursor, toCursor } = state;
                const { cursorRotation, cursorSize } = currentCursor;
                const { cursorRotation: toCursorRotation, cursorSize: toCursorSize } = toCursor;
                const newCursorRotation = mod(clamp(rotDiff(cursorRotation, toCursorRotation) / 6, -5, 5) + cursorRotation, 360);
                const newCursorSize = cursorSize + (toCursorSize - cursorSize) / 8;
                console.log(newCursorRotation, newCursorSize);
                return {
                    currentCursor: {
                        cursorRotation: newCursorRotation,
                        cursorSize: newCursorSize,
                        cursorColor: { fill: "#0ae" },
                    }
                }
            })
            const { currentCursor, toCursor } = this.state;
            if (approx(currentCursor.cursorRotation, toCursor.cursorRotation, 0.01) && approx(currentCursor.cursorSize, toCursor.cursorSize)) {
                clearInterval(this._id as NodeJS.Timer);
            }
        }, 1000 / 60);
    }
}