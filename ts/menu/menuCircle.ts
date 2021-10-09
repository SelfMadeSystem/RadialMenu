import { mod } from "../utils/mathUtils";
import { RadialMenu } from "./radialMenu";

export class MenuCircle {
    public $ele: JQuery<SVGPathElement>;
    constructor(public ele: SVGPathElement, public menu: RadialMenu) {
        this.$ele = $(ele);
        this.setSize(menu.ringSize);
        this.$ele.on("mousemove", e => {
            this.onMove(e);
        });
    }

    public setSize(s: number) {
        const sMin50 = 50 - s;
        this.$ele.attr("d", `
        M50,0 A50,50 0 0,1 100,50 A50,50 0 1,1 50,0
        M50,${s} A${sMin50},${sMin50} 0 0,0 ${s},50 A${sMin50},${sMin50} 0 1,0 50,${s}`)
    }

    public innerRadius(): number {
        return 50 - this.menu.ringSize;
    }

    public outerRadius(): number {
        return 50;
    }

    public thickness(): number {
        return this.menu.ringSize;
    }

    public onMove(e: JQuery.MouseMoveEvent) {
        const x = e.offsetX / this.menu.$ele.width() - 0.5
        const y = e.offsetY / this.menu.$ele.height() - 0.5

        const angle = Math.atan2(y, x) * 180 / Math.PI;

        const index = mod(Math.round(this.menu.getIndex(angle)), this.menu.maxIndex);

        this.menu.setIndex(index)
    }
}