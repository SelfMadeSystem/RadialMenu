import { RadialMenuDrawProps, RadialMenuItemProps, RadialMenuOverlay } from "..";
import { FancyText } from "../fancy-text";
import { Contexts, RadialMenu } from "../radial-menu";
import { Ref } from "../ref";
import { pathItem, getTextPosition } from "../utils/DrawUtils";
import { clampSym, clamp, lerp, angleBetween } from "../utils/MathUtils";
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
    public currentIndex: number;
    public targetIndex: number;
    public animateAt: number = 0;
    public animateTo: number = 0;

    constructor(text: FancyText, ref: Ref<number>, items: RingSelectItem[]) {
        super(text);
        this.ref = ref;
        this.items = items;
        this.currentIndex = this.targetIndex = ref.get();
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
        this.animateTo = 1;
    }

    public drawOverlay(contexts: Contexts, props: RadialMenuDrawProps): void {
        if (this.animateAt !== this.animateTo) {
            const delta = this.animateTo - this.animateAt;

            // TODO: make this configurable
            this.animateAt += clampSym(delta, props.delta * 0.005);
        }

        if (this.animateTo === 0 && this.animateAt === 0) {
            props.menu.unsetOverlay();
            this.currentIndex = this.targetIndex;
            return;
        }

        const ctx = contexts.overlayFg;

        ctx.save();
        ctx.fillStyle = props.theme.highlightOverlay;

        const pos = this.itemProps.center;

        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        ctx.globalAlpha = this.animateAt;

        this.text.draw(ctx, pos, this.itemProps.outerRadius, props.theme.textSize.getTextSize(props.radius), props.theme.font, props.theme.ringText, props.theme.ringText);
        ctx.restore();

        this.drawItems(contexts, props);

        const textSize = props.theme.textSize.getTextSize(props.radius);

        this.drawText(ctx, props, { textSize, offset: { x: 0, y: -textSize * 0.75 } });
    }

    private getDrawItems(index: number): DrawItem[] {
        const itemCount = this.items.length;
        let angleDelta: number = this.itemProps.endAngle - this.itemProps.startAngle;
        const ringAngleDiff = this.parent!.ringProps.endAngle - this.parent!.ringProps.startAngle;
        // FIXME: Not perfect. It can go outside the ring
        if (itemCount * angleDelta > ringAngleDiff) {
            // we still want the selected item to have the same angle
            angleDelta = (ringAngleDiff - angleDelta) / (itemCount - 1);
        }

        angleDelta *= this.animateAt;

        const angleOffset = angleDelta * index;

        let startAngle = this.itemProps.startAngle - angleOffset;
        let endAngle = startAngle + angleDelta;

        const items: DrawItem[] = [];

        for (let i = 0; i < itemCount; i++) {
            const item = this.items[i];
            const t = clamp(Math.abs(i - index), 0, 1);

            if (i > index - 1 && i < index + 1) {
                let newEndAngle = startAngle + this.itemProps.endAngle - this.itemProps.startAngle;
                endAngle = lerp(newEndAngle, endAngle, t);
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
        if (this.currentIndex !== this.targetIndex) {
            const delta = this.targetIndex - this.currentIndex;

            // TODO: make this configurable
            // TODO: when a full circle, go to closest direction
            // TODO: make this configurable
            this.currentIndex += clampSym(delta, props.delta * 0.005);
        }

        const textSize = props.theme.textSize.getTextSize(props.radius);

        const bgCtx = contexts.overlayBg;
        const cursorCtx = contexts.overlayCursor;
        const fgCtx = contexts.overlayFg;

        pathItem(cursorCtx, this.itemProps);
        cursorCtx.fillStyle = props.theme.cursor;
        cursorCtx.fill();

        for (const item of this.getDrawItems(this.currentIndex)) {
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
            fgCtx.globalAlpha = this.animateAt;
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
        this.animateTo = 0;
    }

    public onRingClick(_menu: RadialMenu, angle: number, _distance: number): void {
        // I'm lazy
        const items = this.getDrawItems(this.currentIndex);

        for (let i = 0; i < items.length; i++) {
            const item = items[i];

            if (angleBetween(angle, item.startAngle, item.endAngle)) {
                this.ref.set(i);
                this.targetIndex = i;
                return;
            }
        }
    }
}