import { MenuCircle } from "./menuCircle";
import { MenuCursor } from "./menuCursor";

export class RadialMenu {
    public $ele: JQuery<SVGElement>;
    public circle: MenuCircle;
    public cursor: MenuCursor;
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
        this.circle = new MenuCircle(ele.querySelector(".circle"), this);
        this.cursor = new MenuCursor(ele.querySelector(".cursor"), this);
    }

    public setIndex(index: number) {
        this.index = index;
        this.$ele.attr("data-index", index);
        this.cursor.setIndex(index);
    }
}