import { mod } from "../utils/mathUtils";
import { Vec2 } from "../utils/vec2";
import { MenuRing } from "./menuRing";
import { MenuCursor } from "./menuCursor";
import { MenuProgress } from "./menuProgress";
import { MenuSeperator } from "./menuSeperator";
import { MenuItem } from "./menuItem";
import React from "react";

export class RadialMenu extends React.Component<{}, 
{
    outerRadius: number;
    innerRadius: number;
    thickness: number;
    rotation: number;
    menuItems: MenuItem[];
    menuRings: MenuRing[];
    menuCursor: MenuCursor;
    menuProgress: MenuProgress;
    menuSeperator: MenuSeperator;
}> {
    public center: Vec2 = new Vec2(50, 50);
    public size: number = 100;

    constructor(props: any) {
        super(props);
        this.state = {
            outerRadius: 50,
            innerRadius: 30,
            thickness: 20,
            rotation: 0,
            menuItems: [],
            menuRings: [],
            menuCursor: null,
            menuProgress: null,
            menuSeperator: null,
        }
    }

    init() {
        this.setState({
            menuItems: [],
            menuRings: [<MenuRing menu={this} outerRadius={50} thickness={20} startAngle={0} endAngle={360} fill="#cccccf" key="main"/>],
            menuCursor: (<MenuCursor menu={this} outerRadius={50} thickness={20} fill="#0ae" divisions={8} />),
            menuSeperator: null,
        })
    }

    render() {
        return (
            <svg className="radial-menu" viewBox="0 0 100 100">
                {this.state.menuRings}
                {this.state.menuCursor}
            </svg>
        )
    }

    componentDidMount() {
        this.init();
    }

    getAngle(x: number, y: number) {
        let angle = Math.atan2(y, x);
        return mod(angle, Math.PI * 2);
    }

    getRelativeCoordinates(e: React.MouseEvent<SVGElement>) {
        let x = e.clientX - this.center.x;
        let y = e.clientY - this.center.y;
        return new Vec2(x, y);
    }

    /* public $ele: JQuery<SVGElement>;

    public ring: MenuRing;
    public cursor: MenuCursor;
    public seperator: MenuSeperator;
    public progressBar: MenuProgress;

    public items: MenuItem[] = [];

    public center: Vec2;
    public radius: number;
    public index: number;
    public maxIndex: number;
    public ringSize: number;
    public cursorOffset: number;

    constructor(public ele: SVGElement) {
        this.$ele = $(ele);
        this.index = this.$ele.data("index");
        this.maxIndex = this.$ele.data("max-index");
        this.ringSize = this.$ele.data("ring-size");
        this.cursorOffset = -90 + (this.maxIndex % 2 ? 0 : (180/this.maxIndex));
        this.center = new Vec2(50, 50);
        this.radius = 50;
        this.ring = new MenuRing(ele.querySelector(".ring"), this);
        this.cursor = new MenuCursor(ele.querySelector(".cursor"), this);
        this.seperator = new MenuSeperator(ele.querySelector(".seperator"), this);
        this.progressBar = new MenuProgress(ele.querySelector(".progress-bar"), this);
        ele.querySelectorAll(":scope > .menu > .menu-item").forEach((item, k) => {
            this.items.push(new MenuItem(item as SVGGeometryElement, k, this));
        });
    }

    public setIndex(index: number) {
        this.index = index;
        this.$ele.attr("data-index", index);
        this.cursor.setIndex(index);
    }

    public getAngle(index: number): number {
        return (index * (360/this.maxIndex)) + this.cursorOffset;
    }

    // You must round it yourself
    public getIndex(angle: number): number {
        return (angle - this.cursorOffset) / (360/this.maxIndex);
    } */
}