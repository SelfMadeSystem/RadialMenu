import { RadialMenuDrawProps, RadialMenuItemProps, RadialMenuOverlay } from "..";
import { FancyText } from "../fancy-text";
import { Contexts, RadialMenu } from "../radial-menu";
import { Ref } from "../ref";
import { pathItem } from "../utils/DrawUtils";
import { clampSym, clamp } from "../utils/MathUtils";
import { RingItemBase } from "./ring-item-base";

export class RingRange extends RingItemBase implements RadialMenuOverlay {
    public ref: Ref<number>;
    public min: number;
    public max: number;
    public step?: number;
    public animateTime: number = 0;
    public animateTarget: number = 0;
    // TODO: make this configurable
    public readonly ringAngleDiff: number = 0.2;

    constructor(text: FancyText, ref: Ref<number>, min: number, max: number, step?: number) {
        super(text);
        this.ref = ref;
        this.min = min;
        this.max = max;
        this.step = step;
    }

    public updateItemProps(props: RadialMenuItemProps): void {
        this.itemProps = props;
    }

    public drawItem(contexts: Contexts, props: RadialMenuDrawProps): void {
        const ctx = contexts.foreground;
        this.startClip(ctx);

        const textSize = props.theme.textSize.getTextSize(props.radius);

        const rect = this.drawText(ctx, props, { textSize, offset: { x: 0, y: -textSize * 0.75 } });

        const pos = {
            x: rect.x + rect.width * 0.5,
            y: rect.y + rect.height,
        };

        ctx.fillText(this.ref.get().toFixed(2), pos.x, pos.y + textSize * 0.75);

        this.endClip(ctx);
    }

    public onClick(menu: RadialMenu): void {
        menu.setOverlay(this);
        this.animateTarget = 1.0;
    }

    public drawOverlay(contexts: Contexts, props: RadialMenuDrawProps): void {
        const ctx = contexts.overlayFg;

        ctx.save();
        ctx.fillStyle = props.theme.highlightOverlay;

        const pos = this.itemProps.center;

        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        ctx.globalAlpha = this.animateTime * 2;


        const textSize = props.theme.textSize.getTextSize(props.radius);

        ctx.font = `${textSize}px ${props.theme.font}`;

        const rect = this.text.draw(ctx, pos, this.itemProps.outerRadius, props.theme.textSize.getTextSize(props.radius), props.theme.font, props.theme.ringText, props.theme.ringText);

        const textPos = {
            x: rect.x + rect.width * 0.5,
            y: rect.y + rect.height,
        };

        ctx.fillText(this.ref.get().toFixed(2), textPos.x, textPos.y + textSize * 0.75);
        ctx.restore();

        this.drawSlider(ctx, props);
    }

    public drawSlider(ctx: CanvasRenderingContext2D, props: RadialMenuDrawProps): void {
        if (this.animateTime !== this.animateTarget) {
            const delta = this.animateTarget - this.animateTime;

            this.animateTime += clampSym(delta, props.delta * 0.002); // TODO: make this configurable

            if (this.animateTime === 0 && this.animateTarget === 0) {
                props.menu.unsetOverlay();
                return;
            }
        }
        ctx.save();

        ctx.globalAlpha = this.animateTime * 2;

        pathItem(ctx, this.parent!.ringProps);
        ctx.fillStyle = props.theme.ringBg;
        ctx.fill();

        ctx.strokeStyle = props.theme.sliderBg;
        ctx.lineWidth = props.theme.sliderWidth.getTextSize(props.radius);
        ctx.lineCap = "round";

        ctx.beginPath();
        const ringProps = this.parent!.ringProps;

        const minAngle = ringProps.startAngle + this.ringAngleDiff;
        const maxAngle = ringProps.endAngle - this.ringAngleDiff;

        const animatedMaxAngle = minAngle + (maxAngle - minAngle) * this.animateTime;

        ctx.arc(ringProps.center.x, ringProps.center.y, (ringProps.outerRadius + ringProps.innerRadius) / 2, minAngle, animatedMaxAngle);
        ctx.stroke();

        ctx.strokeStyle = props.theme.sliderFg;

        ctx.beginPath();
        const angle = minAngle + (maxAngle - minAngle) * (this.ref.get() - this.min) / (this.max - this.min);

        const animatedAngle = Math.min(animatedMaxAngle, angle);

        ctx.arc(ringProps.center.x, ringProps.center.y, (ringProps.outerRadius + ringProps.innerRadius) / 2, minAngle, animatedAngle);
        ctx.stroke();

        ctx.restore();
    }

    public onCenterClick(_menu: RadialMenu): void {
        this.animateTarget = 0.0;
    }

    public onRingHover(_menu: RadialMenu, angle: number, _distance: number, click: boolean): void {
        if (!click) {
            return;
        }
        if (this.animateTime !== 1) {
            return;
        }

        const ringProps = this.parent!.ringProps;

        const minAngle = ringProps.startAngle + this.ringAngleDiff;
        const maxAngle = ringProps.endAngle - this.ringAngleDiff;

        const animatedMaxAngle = minAngle + (maxAngle - minAngle) * this.animateTime;

        let value = this.min + (this.max - this.min) * (angle - minAngle) / (animatedMaxAngle - minAngle);

        if (this.step) {
            value = Math.round(value / this.step) * this.step;
        }

        value = clamp(value, this.min, this.max);

        this.ref.set(value);
    }

    public onRingClick(_menu: RadialMenu, angle: number, _distance: number): void {
        this.onRingHover(_menu, angle, _distance, true);
    }
}