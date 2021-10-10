import { rotDiff } from "../utils/mathUtils";
import { annularSector } from "../utils/svgUtils";
import { RadialMenu } from "./radialMenu";

export class MenuCursor {
    public $ele: JQuery<SVGPathElement>;
    public widthTime = 0;
    public widthTransitionTime = 0.4;
    public width: number = 0;
    public prevWidth: number = 0;
    private prevFrame = 0;
    constructor(public ele: SVGPathElement, public menu: RadialMenu) {
        this.$ele = $(ele);
        this.setWidth(360 / menu.maxIndex);
        this.setIndex(menu.index);
        requestAnimationFrame(() => this.$ele.css("transition", "transform 0.2s ease"));
    }

    public setWidth(width: number) {
        this.prevWidth = this.width;
        this.width = width;
        this.widthTime = 0;
        this.prevFrame = new Date().getTime();
        this._transWidth();
    }

    private _transWidth() {
        let width = this.width;
        let prevWidth = this.prevWidth;
        let widthDiff = width - prevWidth;
        let widthTime = this.widthTime;
        let widthTransitionTime = this.widthTransitionTime;
        let widthTimeRatio = widthTime / widthTransitionTime;
        widthTimeRatio = Math.min(widthTimeRatio, 1);

        let currentWidth = widthTimeRatio * widthDiff + prevWidth;

        this._setWidth(currentWidth);

        if (this.widthTime < this.widthTransitionTime) {
            this.widthTime += (new Date().getTime() - this.prevFrame) / 1000;
            requestAnimationFrame(() => this._transWidth());
        }
        
        this.prevFrame = new Date().getTime();
    }

    private _setWidth(width: number) {
        this.$ele.attr("d", annularSector({
            centerX: 50,
            centerY: 50,
            startDegrees: -width/2,
            endDegrees: width/2,
            // innerRadius: 50 - this.menu.ringSize - 10,
            // outerRadius: 50 - this.menu.ringSize
            outerRadius: 50,
            thickness: this.menu.ringSize
        }))
    }

    public setIndex(index: number) {
        this.$ele.attr("data-index", index);
        this.setAngle(this.menu.getAngle(index));
    }

    public setAngle(angle: number) {
        var currentAngle = this.ele.style.transform == "" ? 0 : parseFloat(this.ele.style.transform.split("rotate(")[1].split("deg)")[0])

        if (currentAngle != angle) {
            this.ele.style.transform = `rotate(${rotDiff(currentAngle, angle) + currentAngle}deg)`;
        }
    }
}