import { RadialMenuDrawProps, RadialMenuItem, RadialMenuItemProps, RadialMenuRing } from "..";
import { RadialMenu } from "../radial-menu";
import { Vec2, getTextPosition, pathItem } from "../utils";

export class RingItemBase implements RadialMenuItem {
    public parent?: RadialMenuRing | undefined;
    public itemProps: RadialMenuItemProps;
    public name: string; // TODO: Add more customization options, like font, color, icon, etc.

    constructor(text: string) {
        this.name = text;
        this.itemProps = {
            center: { x: 0, y: 0 },
            innerRadius: 0,
            outerRadius: 0,
            startAngle: 0,
            endAngle: 0,
        };
    }

    public updateItemProps(props: RadialMenuItemProps): void {
        this.itemProps = props;
    }

    public startClip(ctx: CanvasRenderingContext2D): void {
        ctx.save();

        pathItem(ctx, this.itemProps);
        ctx.clip();
    }

    public endClip(ctx: CanvasRenderingContext2D): void {
        ctx.restore();
    }

    public drawText(ctx: CanvasRenderingContext2D, props: RadialMenuDrawProps): Vec2 {
        ctx.fillStyle = props.colors.ringText;

        const pos = getTextPosition(this.itemProps, this.name, ctx);

        ctx.fillText(this.name, pos.x, pos.y);

        return pos;
    }

    public drawItem(ctx: CanvasRenderingContext2D, props: RadialMenuDrawProps): void {
        this.startClip(ctx);
        this.drawText(ctx, props);
        this.endClip(ctx);
    }

    public onClick(_menu: RadialMenu): void {
    }
}