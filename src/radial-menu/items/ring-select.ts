import { RadialMenuDrawProps, RadialMenuItemProps, RadialMenuOverlay } from "..";
import { FancyText } from "../fancy-text";
import { Contexts, RadialMenu } from "../radial-menu";
import { Ref } from "../ref";
import { AnimatedValue, smoothAnimate } from "../utils/AnimatedValue";
import { pathItem, getTextPosition } from "../utils/DrawUtils";
import { clamp, lerp, angleBetween, distanceWrap } from "../utils/MathUtils";
import { RingItemBase } from "./ring-item-base";

type RingSelectItem = {
    toString(): string;
};

type DrawItem = {
    text: string;
    startAngle: number;
    endAngle: number;
    primary: number;
};

export class RingSelect extends RingItemBase implements RadialMenuOverlay {
    public ref: Ref<number>; // index
    public items: RingSelectItem[];
    // For animation
    // TODO: make these configurable
    public index: AnimatedValue = new AnimatedValue(0, 0.005, smoothAnimate);
    public animate: AnimatedValue = new AnimatedValue(0, 0.005);

    constructor(text: FancyText, ref: Ref<number>, items: RingSelectItem[]) {
        super(text);
        this.ref = ref;
        this.items = items;
        this.index.setBoth(ref.get());
    }

    public updateItemProps(props: RadialMenuItemProps): void {
        this.itemProps = props;
    }

    public getText(): string {
        return this.items[this.ref.get()].toString();
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

        ctx.fillText(this.getText(), pos.x, pos.y + textSize * 0.75);

        this.endClip(ctx);
    }

    public onClick(menu: RadialMenu): void {
        menu.setOverlay(this);
        this.animate.setTarget(1);
    }

    public drawOverlay(contexts: Contexts, props: RadialMenuDrawProps): void {
        this.animate.update(props.deltaTime);
        if (this.animate.reached() && this.animate.targetValue === 0) {
            props.menu.unsetOverlay();
            this.index.snap();
            return;
        }

        const ctx = contexts.overlayFg;

        ctx.save();
        ctx.fillStyle = props.theme.highlightOverlay;

        const pos = this.itemProps.center;

        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        ctx.globalAlpha = this.animate.getValue();

        this.text.draw(ctx, pos, this.itemProps.outerRadius, props.theme.textSize.getTextSize(props.radius), props.theme.font, props.theme.ringText, props.theme.ringText);
        ctx.restore();

        this.drawItems(contexts, props);

        const textSize = props.theme.textSize.getTextSize(props.radius);

        this.drawText(ctx, props, { textSize, offset: { x: 0, y: -textSize * 0.75 } });
    }

    private moreThanFullCircle(): boolean {
        const itemCount = this.items.length;
        let angleDelta: number = this.itemProps.endAngle - this.itemProps.startAngle;
        const ringAngleDiff = this.parent!.ringProps.endAngle - this.parent!.ringProps.startAngle;
        // FIXME: Not perfect. It can go outside the ring
        return itemCount * angleDelta > ringAngleDiff;
    }

    private getDrawItems(index: number): DrawItem[] {
        const itemCount = this.items.length;
        let angleDelta: number = this.itemProps.endAngle - this.itemProps.startAngle;
        const ringAngleDiff = this.parent!.ringProps.endAngle - this.parent!.ringProps.startAngle;
        // FIXME: Not perfect. It can go outside the ring
        if (this.moreThanFullCircle()) {
            // we still want the selected item to have the same angle
            angleDelta = (ringAngleDiff - angleDelta) / (itemCount - 1);
        }

        angleDelta *= this.animate.getValue();

        const angleOffset = angleDelta * index;

        let startAngle = this.itemProps.startAngle - angleOffset;
        let endAngle = startAngle + angleDelta;

        const items: DrawItem[] = [];

        for (let i = 0; i < itemCount; i++) {
            const item = this.items[i];
            const t = clamp(Math.abs(distanceWrap(i, index, 0, itemCount)), 0, 1);

            if (t < 1) {
                if (index > itemCount - 1 && i === 0) {
                    let newStartAngle = endAngle - this.itemProps.endAngle + this.itemProps.startAngle;
                    startAngle = lerp(newStartAngle, startAngle, t);
                } else {
                    let newEndAngle = startAngle + this.itemProps.endAngle - this.itemProps.startAngle;
                    endAngle = lerp(newEndAngle, endAngle, t);
                }
            }

            items.push({
                text: item.toString(),
                startAngle,
                endAngle,
                primary: t,
            });

            startAngle = endAngle;
            endAngle = startAngle + angleDelta;
        }

        return items;
    }

    public drawItems(contexts: Contexts, props: RadialMenuDrawProps): void {
        this.index.wrapNums = this.moreThanFullCircle() ? [0, this.items.length] : undefined;
        this.index.update(props.deltaTime);

        const textSize = props.theme.textSize.getTextSize(props.radius);

        const bgCtx = contexts.overlayBg;
        const cursorCtx = contexts.overlayCursor;
        const fgCtx = contexts.overlayFg;

        pathItem(cursorCtx, this.itemProps);
        cursorCtx.fillStyle = props.theme.cursor;
        cursorCtx.fill();

        const items = this.getDrawItems(this.index.getValue());
        for (let i = 0; i < items.length; i++) {
            const item = items[i];
            const itemProps: RadialMenuItemProps = {
                ...this.itemProps,
                startAngle: item.startAngle,
                endAngle: item.endAngle,
            };

            // TODO: Animate this
            // TODO: Don't make this look garbo

            pathItem(bgCtx, itemProps);
            bgCtx.fillStyle = props.theme.ringBg;

            bgCtx.fill();

            fgCtx.save();

            pathItem(fgCtx, itemProps);
            fgCtx.globalAlpha = this.animate.getValue();
            fgCtx.stroke(); // temporary. just so it looks different
            fgCtx.globalAlpha = 1;

            fgCtx.clip();

            fgCtx.fillStyle = props.theme.ringText;

            const text = item.text;

            const rect = this.getTextRect(fgCtx, props, { textSize, offset: { x: 0, y: -textSize * 0.75 }, itemProps });

            const posRect = {
                x: rect.x + rect.width * 0.5,
                y: rect.y + rect.height,
            };

            const posCenter = getTextPosition(itemProps);

            const pos = {
                x: lerp(posRect.x, posCenter.x, item.primary),
                y: lerp(posRect.y + textSize * 0.75, posCenter.y, item.primary),
            };

            fgCtx.fillText(text, pos.x, pos.y);

            fgCtx.restore();
        }
    }

    public onCenterClick(_menu: RadialMenu): void {
        this.animate.setTarget(0);
    }

    public onRingClick(_menu: RadialMenu, angle: number, _distance: number): void {
        // I'm lazy
        const items = this.getDrawItems(this.index.getValue());

        for (let i = 0; i < items.length; i++) {
            const item = items[i];

            if (angleBetween(angle, item.startAngle, item.endAngle)) {
                this.ref.set(i);
                this.index.setTarget(i);
                return;
            }
        }
    }
}