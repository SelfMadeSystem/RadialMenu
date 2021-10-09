import { toRad } from "../utils/mathUtils";
import { RadialMenu } from "./radialMenu";

export class MenuSeperator {
    public $ele: JQuery<SVGPathElement>;
    constructor(public ele: SVGPathElement, public menu: RadialMenu) {
        this.$ele = $(ele);
        this.reset();
    }

    public reset() {
        let d = "";
        for (let i = 0; i < this.menu.maxIndex; i++) {
            const angle = toRad(this.menu.getAngle(i + 0.5));
            const x1 = this.menu.center.x + this.menu.circle.innerRadius() * Math.cos(angle);
            const y1 = this.menu.center.y + this.menu.circle.innerRadius() * Math.sin(angle);
            const x2 = this.menu.center.x + this.menu.circle.outerRadius() * Math.cos(angle);
            const y2 = this.menu.center.y + this.menu.circle.outerRadius() * Math.sin(angle);
            
            d += `M ${x1} ${y1} L ${x2} ${y2} `;
        }

        this.$ele.attr("d", d);
    }
}