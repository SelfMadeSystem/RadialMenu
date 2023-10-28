import { RadialMenuDrawProps, RadialMenuItem, RadialMenuItemProps, RadialMenuRing } from "..";
import { RadialMenu } from "../radial-menu";
import { Ref } from "../ref";
import { getTextPosition, pathItem } from "../utils";

export class RingBool implements RadialMenuItem {
    public parent?: RadialMenuRing | undefined;
    public itemProps: RadialMenuItemProps;
    public name: string;
    public ref: Ref<boolean>;

    constructor(text: string, ref: Ref<boolean>) {
        this.name = text;
        this.ref = ref;
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

    public drawItem(ctx: CanvasRenderingContext2D, props: RadialMenuDrawProps): void {
        ctx.save();

        pathItem(ctx, this.itemProps);
        ctx.clip();

        ctx.fillStyle = props.colors.ringText;

        const pos = getTextPosition(this.itemProps, this.name, ctx);

        ctx.fillText(this.name, pos.x, pos.y);

        ctx.fillText(this.ref.get() ? "true" : "false", pos.x, pos.y + 20);

        ctx.restore();
    }

    public onClick(_menu: RadialMenu): void {
        this.ref.set(!this.ref.get());
    }
}