import { mod } from "../utils/mathUtils";
import { Vec2 } from "../utils/vec2";
import { MenuRing } from "./menuRing";
import { MenuCursor } from "./menuCursor";
import { MenuProgress } from "./menuProgress";
import { MenuSeperator } from "./menuSeperator";

export class RadialMenu {
    public $ele: JQuery<SVGElement>;

    public ring: MenuRing;
    public cursor: MenuCursor;
    public seperator: MenuSeperator;
    public progressBar: MenuProgress;

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
    }
}