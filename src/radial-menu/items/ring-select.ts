import { RadialMenuDrawProps, RadialMenuItemProps, RadialMenuOverlay } from "..";
import { Contexts, RadialMenu } from "../radial-menu";
import { Ref } from "../ref";
import { angleDiff, getTextPosition, pathItem } from "../utils";
import { RingItemBase } from "./ring-item-base";

export class RingSelect extends RingItemBase implements RadialMenuOverlay {
    public ref: Ref<number>; // index
    public items: string[];
    public rotation: number = 0;
    public rotationTarget: number = 0;

    constructor(text: string, ref: Ref<number>, items: string[]) {
        super(text);
        this.ref = ref;
        this.items = items;
    }

    public updateItemProps(props: RadialMenuItemProps): void {
        this.itemProps = props;
    }

    public getText(): string {
        return this.items[this.ref.get()];
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
        const ctx = contexts.overlay;

        ctx.save();
        ctx.fillStyle = props.colors.highlightOverlay;

        const pos = this.itemProps.center;

        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        // TODO: Animate this

        ctx.fillText(this.name, pos.x, pos.y);

        ctx.fillText(this.getText(), pos.x, pos.y + 20);
        ctx.restore();

        this.drawItems(contexts, props);
    }

    public drawItems(contexts: Contexts, props: RadialMenuDrawProps): void {
        const ctx = contexts.overlay;

        ctx.save();
        ctx.fillStyle = props.colors.highlightOverlay;

        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        const itemCount = this.items.length;
        const angleDelta = this.itemProps.endAngle - this.itemProps.startAngle; // FIXME: when item count overflows the circle
        const angleOffset = angleDelta * this.ref.get();
        const startProps: RadialMenuItemProps = {
            ...this.itemProps,
            startAngle: this.itemProps.startAngle - angleOffset,
            endAngle: this.itemProps.endAngle - angleOffset,
        };
        ctx.restore();

        for (let i = 0; i < itemCount; i++) {
            const item = this.items[i];

            const itemProps: RadialMenuItemProps = {
                ...startProps,
                startAngle: startProps.startAngle + angleDelta * i,
                endAngle: startProps.endAngle + angleDelta * i,
            };

            ctx.save();
            pathItem(ctx, itemProps);

            // ctx.globalAlpha = this.getAlpha(i);

            // TODO: Animate this
            // TODO: Don't make this look garbo

            if (i === this.ref.get()) {
                ctx.fillStyle = props.colors.cursor;
            } else {
                ctx.fillStyle = props.colors.ringBg;
            }

            ctx.fill();
            ctx.stroke(); // temporary. just so it looks different

            ctx.clip();

            ctx.fillStyle = props.colors.ringText;

            const pos = getTextPosition(itemProps, item, ctx);

            ctx.fillText(item, pos.x, pos.y);

            ctx.restore();
        }
    }

    public onCenterClick(menu: RadialMenu): void {
        menu.unsetOverlay();
    }

    public onRingClick(_menu: RadialMenu, angle: number, _distance: number): void {
        const angleDelta = this.itemProps.endAngle - this.itemProps.startAngle;
        const angleOffset = angleDelta * this.ref.get();
        const startAngle = this.itemProps.startAngle - angleOffset;

        const diff = angleDiff(startAngle, angle);

        const index = Math.floor(diff / angleDelta);

        // FIXME: Doesn't work when items go beyond 180 degrees

        if (index < 0 || index >= this.items.length) {
            return;
        }

        this.ref.set(index);
    }
}