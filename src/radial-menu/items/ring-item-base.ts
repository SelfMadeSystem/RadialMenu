import { RadialMenuDrawProps, RadialMenuItem, RadialMenuItemProps, RadialMenuRing } from "..";
import { Contexts, RadialMenu } from "../radial-menu";
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

    public drawText(
        ctx: CanvasRenderingContext2D,
        props: RadialMenuDrawProps,
        options?: { offset?: Vec2, textSize?: number; }
    ): Vec2 {
        let offset: Vec2 | undefined = options?.offset;
        let textSize: number | undefined = options?.textSize;

        if (textSize === undefined) {
            textSize = props.theme.textSize.getTextSize(props.radius);
        }

        ctx.fillStyle = props.theme.ringText;

        ctx.font = `${textSize}px ${props.theme.font}`;

        const ogPos = getTextPosition(this.itemProps, this.name, ctx);

        const textPos = {
            x: ogPos.x,
            y: ogPos.y,
        };

        if (offset !== undefined) {
            textPos.x += offset.x;
            textPos.y += offset.y;
        }

        ctx.fillText(this.name, textPos.x, textPos.y);

        return ogPos;
    }

    public drawItem(contexts: Contexts, props: RadialMenuDrawProps): void {
        const ctx = contexts.foreground;

        this.startClip(ctx);
        this.drawText(ctx, props);
        this.endClip(ctx);
    }

    public onClick(_menu: RadialMenu): void {
    }
}