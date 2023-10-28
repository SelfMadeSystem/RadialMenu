import { RadialMenuDrawProps, RadialMenuItem, RadialMenuItemProps, RadialMenuRing } from "..";
import { RadialMenu } from "../radial-menu";
import { getTextPosition, pathItem } from "../utils";

export class RingMenu implements RadialMenuRing {
    public parent?: RadialMenuRing | undefined;
    public itemProps: RadialMenuItemProps;
    private selectedIndex: number = 0;
    private cursorAngle: number = 0;
    private anglePerItem: number = 0;

    constructor(
        public readonly name: string,
        public items: RadialMenuItem[],
    ) {
        this.itemProps = {
            center: { x: 0, y: 0 },
            innerRadius: 0,
            outerRadius: 0,
            startAngle: 0,
            endAngle: 0,
        };

        for (const item of items) {
            item.parent = this;
        }
    }

    public updateItemProps(props: RadialMenuItemProps): void {
        this.itemProps = props;

        const itemCount = this.items.length;
        if (itemCount === 0) {
            this.anglePerItem = 0;
            return;
        }
        const anglePerItem = (props.endAngle - props.startAngle) / itemCount;
        const angleOffset = props.startAngle;

        for (let i = 0; i < itemCount; i++) {
            const item = this.items[i];
            const startAngle = angleOffset + anglePerItem * i;
            const endAngle = startAngle + anglePerItem;

            item.updateItemProps({
                ...props,
                startAngle,
                endAngle,
            });
        }

        this.anglePerItem = anglePerItem;
        this.cursorAngle = this.getCursorAngle(this.selectedIndex);
    }

    public drawRing(ctx: CanvasRenderingContext2D, props: RadialMenuDrawProps): void {
        pathItem(ctx, this.itemProps);
        ctx.fillStyle = props.colors.ringBg;
        ctx.fill();

        this.drawCursor(ctx, props);

        for (const item of this.items) {
            item.drawItem(ctx, props);
        }
    }

    private drawCursor(ctx: CanvasRenderingContext2D, props: RadialMenuDrawProps): void {
        const cursorProps: RadialMenuItemProps = {
            ...this.itemProps,
            startAngle: this.cursorAngle,
            endAngle: this.cursorAngle + this.anglePerItem,
        };

        pathItem(ctx, cursorProps);

        ctx.fillStyle = props.colors.cursor;
        ctx.fill();
    }

    private getItemIndexAtAngle(angle: number): number | undefined {
        const itemCount = this.items.length;
        if (itemCount === 0) {
            return undefined;
        }

        const angleOffset = this.itemProps.startAngle;
        const anglePerItem = (this.itemProps.endAngle - this.itemProps.startAngle) / itemCount;

        const index = Math.floor((angle - angleOffset) / anglePerItem);

        if (index < 0 || index >= itemCount) {
            return undefined;
        }

        return index;
    }

    private getItemAtAngle(angle: number): RadialMenuItem | undefined {
        const index = this.getItemIndexAtAngle(angle);
        if (index === undefined) {
            return undefined;
        }

        return this.items[index];
    }

    private getCursorAngle(index: number): number {
        return this.itemProps.startAngle + this.anglePerItem * index;
    }

    public onCenterClick(menu: RadialMenu): void {
        if (this.parent) {
            menu.setRing(this.parent);
        }
    }

    public onRingHover(_menu: RadialMenu, angle: number, _distance: number): void {
        console.log(angle);
        const index = this.getItemIndexAtAngle(angle);
        if (index !== undefined) {
            this.cursorAngle = this.getCursorAngle(index);
            this.selectedIndex = index;
        }
    }

    public onRingClick(menu: RadialMenu, angle: number, _distance: number): void {
        const item = this.getItemAtAngle(angle);
        if (item) {
            item.onClick(menu);
        }
    }

    public drawItem(ctx: CanvasRenderingContext2D, props: RadialMenuDrawProps): void {
        ctx.fillStyle = props.colors.ringText;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        const pos = getTextPosition(this.itemProps, this.name, ctx);

        ctx.fillText(this.name, pos.x, pos.y);
    }

    public onClick(menu: RadialMenu): void {
        menu.setRing(this);
    }
}