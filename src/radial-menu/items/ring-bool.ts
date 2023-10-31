import { RadialMenuDrawProps, RadialMenuItemProps } from "..";
import { FancyText } from "../fancy-text";
import { Contexts, RadialMenu } from "../radial-menu";
import { Ref } from "../ref";
import { RingItemBase } from "./ring-item-base";

export class RingBool extends RingItemBase {
    public ref: Ref<boolean>;

    constructor(text: FancyText, ref: Ref<boolean>) {
        super(text);
        this.ref = ref;
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

        ctx.fillText(this.ref.get() ? "true" : "false", pos.x, pos.y + textSize * 0.75);

        this.endClip(ctx);
    }

    public onClick(_menu: RadialMenu): void {
        this.ref.set(!this.ref.get());
    }
}