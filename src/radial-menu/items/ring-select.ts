import { RadialMenuDrawProps, RadialMenuItemProps, RadialMenuOverlay } from "..";
import { Contexts, RadialMenu } from "../radial-menu";
import { Ref } from "../ref";
import { angleBetween, clamp, clampSym, getTextPosition, lerp, pathItem } from "../utils";
import { RingItemBase } from "./ring-item-base";

type RingSelectItem = {
    toString(): string;
};

type DrawItem = {
    text: string;
    startAngle: number;
    endAngle: number;
};

export class RingSelect extends RingItemBase implements RadialMenuOverlay {
    public ref: Ref<number>; // index
    public items: RingSelectItem[];
    // For animation
    public currentIndex: number;
    public targetIndex: number;

    constructor(text: string, ref: Ref<number>, items: RingSelectItem[]) {
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

        const pos = this.drawText(ctx, props);

        ctx.fillText(this.getText(), pos.x, pos.y + 20);

        this.endClip(ctx);
    }

    public onClick(menu: RadialMenu): void {
        menu.setOverlay(this);
    }

    public drawOverlay(contexts: Contexts, props: RadialMenuDrawProps): void {
        const ctx = contexts.overlayFg;

        ctx.save();
        ctx.fillStyle = props.colors.highlightOverlay;

        const pos = this.itemProps.center;

        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        // TODO: Animate this

        ctx.fillText(this.name, pos.x, pos.y);
        ctx.restore();

        this.drawItems(contexts, props);
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

        const angleOffset = angleDelta * index;

        let startAngle = this.itemProps.startAngle - angleOffset;
        let endAngle = startAngle + angleDelta;

        const items: DrawItem[] = [];

        for (let i = 0; i < itemCount; i++) {
            const item = this.items[i];

            if (i > index - 1 && i < index + 1) {
                const t = clamp(Math.abs(i - index), 0, 1);
                let newEndAngle = startAngle + this.itemProps.endAngle - this.itemProps.startAngle;
                endAngle = lerp(newEndAngle, endAngle, t);
            }

            items.push({
                text: item.toString(),
                startAngle,
                endAngle,
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
            this.currentIndex += clampSym(delta, props.delta * 0.005);
        }

        const bgCtx = contexts.overlayBg;
        const cursorCtx = contexts.overlayCursor;
        const fgCtx = contexts.overlayFg;

        pathItem(cursorCtx, this.itemProps);
        cursorCtx.fillStyle = props.colors.cursor;
        cursorCtx.fill();

        for (const item of this.getDrawItems(this.currentIndex)) {
            const itemProps: RadialMenuItemProps = {
                ...this.itemProps,
                startAngle: item.startAngle,
                endAngle: item.endAngle,
            };

            // ctx.globalAlpha = this.getAlpha(i);

            // TODO: Animate this
            // TODO: Don't make this look garbo

            pathItem(bgCtx, itemProps);
            bgCtx.fillStyle = props.colors.ringBg;

            bgCtx.fill();

            fgCtx.save();

            pathItem(fgCtx, itemProps);
            fgCtx.stroke(); // temporary. just so it looks different

            fgCtx.clip();

            fgCtx.fillStyle = props.colors.ringText;

            const text = item.text;

            const pos = getTextPosition(itemProps, text, fgCtx);

            fgCtx.fillText(text, pos.x, pos.y);

            fgCtx.restore();
        }
    }

    public onCenterClick(menu: RadialMenu): void {
        menu.unsetOverlay();
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