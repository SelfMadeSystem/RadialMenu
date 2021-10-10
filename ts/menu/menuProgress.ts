import { mod } from "../utils/mathUtils";
import { RadialMenu } from "./radialMenu";

export class MenuProgress {
    public $ele: JQuery<SVGPathElement>;
    public thickness: number;
    public progress: number;
    public animated: boolean;
    constructor(public ele: SVGPathElement, public menu: RadialMenu) {
        this.$ele = $(ele);
        this.thickness = parseFloat(this.$ele.attr("stroke-width")) || 1;
        
        this.setProgress(0.6);

        let time = 0;
        let time1 = 0;
        let timeAdd = 0.004;
        let timeAdd1 = 0.035;
        let mult = 0.025;

        function _() {
            time += timeAdd;
            time1 += timeAdd1;
            // if (time1 % 2 > time % 2) {
            //     let temp = timeAdd;
            //     timeAdd = timeAdd1;
            //     timeAdd1 = temp;
            //     temp = time;
            //     time = time1;
            //     time1 = temp;
            // }
            this.$ele.attr("d", this.getPath(time, time + 0.5/*  + Math.cos(time1) * mult */));
            requestAnimationFrame(_.bind(this));
        }

        requestAnimationFrame(() => {
            requestAnimationFrame(_.bind(this));
        });
    }

    public setProgress(progress: number, animated: boolean = false) {
        this.progress = progress;
        this.animated = animated;
        this.update();
    }

    public update() {
        if (this.animated) {
            this.animate();
        } else {
            this.draw();
        }
    }

    public draw() {
        this.$ele.attr("d", this.getPath(this.progress));
    }

    public animate() {
        this.$ele.attr("d", this.getPath(0));
        this.$ele.animate({ d: this.getPath(this.progress) }, { duration: 5 });
    }

    public getPath(end: number, start: number = 1) {
        const radius = this.menu.ring.innerRadius() - this.thickness;
        const startAngle = start * 360 + 0.001;
        const endAngle = end * 360;

        const startX = radius * Math.cos(startAngle * Math.PI / 180) + 50;
        const startY = radius * Math.sin(startAngle * Math.PI / 180) + 50;
        const endX = radius * Math.cos(endAngle * Math.PI / 180) + 50;
        const endY = radius * Math.sin(endAngle * Math.PI / 180) + 50;

        const largeArc = mod(start - end, 1) < 0.5 ? 1 : 0;

        return `M ${startX} ${startY} A ${radius} ${radius} 0 ${largeArc} 1 ${endX} ${endY}`;
    }
}