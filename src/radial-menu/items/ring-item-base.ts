import { RadialMenuDrawProps, RadialMenuItem, RadialMenuItemProps, RadialMenuRing } from "..";
import { FancyText } from "../fancy-text";
import { Contexts, RadialMenu } from "../radial-menu";
import { pathItem, getTextPosition } from "../utils/DrawUtils";
import { Vec2 } from "../utils/Vec2";

export class RingItemBase implements RadialMenuItem {
    public parent?: RadialMenuRing | undefined;
    public itemProps: RadialMenuItemProps;
    public text: FancyText;

    constructor(text: FancyText) {
        this.text = text;
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
    ): DOMRect {
        let offset: Vec2 | undefined = options?.offset;
        let textSize: number | undefined = options?.textSize;

        if (textSize === undefined) {
            textSize = props.theme.textSize.getTextSize(props.radius);
        }

        ctx.fillStyle = props.theme.ringText;

        ctx.font = `${textSize}px ${props.theme.font}`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        const ogPos = getTextPosition(this.itemProps);

        const textPos = {
            x: ogPos.x,
            y: ogPos.y,
        };

        if (offset !== undefined) {
            textPos.x += offset.x;
            textPos.y += offset.y;
        }

        return this.text.draw(ctx, textPos, this.itemProps.outerRadius, textSize, props.theme.font, props.theme.ringText, props.theme.ringText);
    }

    public getTextRect(
        ctx: CanvasRenderingContext2D,
        props: RadialMenuDrawProps,
        options?: { offset?: Vec2, textSize?: number; itemProps?: RadialMenuItemProps; }
    ): DOMRect {
        let offset: Vec2 | undefined = options?.offset;
        let textSize: number | undefined = options?.textSize;

        if (textSize === undefined) {
            textSize = props.theme.textSize.getTextSize(props.radius);
        }

        const ogPos = getTextPosition(options?.itemProps ?? this.itemProps);

        const textPos = {
            x: ogPos.x,
            y: ogPos.y,
        };

        if (offset !== undefined) {
            textPos.x += offset.x;
            textPos.y += offset.y;
        }

        return this.text.getRect(ctx, textPos, this.itemProps.outerRadius, textSize);
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