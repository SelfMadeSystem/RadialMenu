import { toRad } from "../utils/mathUtils";
import { RadialMenu } from "./radialMenu";

export class MenuItem {
    public $ele: JQuery<SVGGeometryElement>;
    public width: number;
    public height: number;
    constructor(public ele: SVGGeometryElement, public index: number, public menu: RadialMenu) {
        this.$ele = $(ele);
        this.width = this.ele.getBBox().width;
        this.height = this.ele.getBBox().height;
        this.updatePosition();
    }

    public setIndex(index: number) {
        this.index = index;
    }

    public updatePosition() {
        const angle = toRad(this.menu.getAngle(this.index));
        const radius = this.menu.ring.innerRadius() + this.menu.ring.thickness() / 2;
        const x = radius * Math.cos(angle) + this.menu.center.x - this.width / 2;
        const y = radius * Math.sin(angle) + this.menu.center.y - this.height / 2;
        this.$ele.attr("x", x);
        this.$ele.attr("y", y);
    }
}