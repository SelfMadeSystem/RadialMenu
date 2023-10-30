import { RadialMenuDrawProps, RadialMenuItem, RadialMenuItemProps, RadialMenuRingProps, RadialMenuRing } from "..";
import { Contexts, RadialMenu } from "../radial-menu";
import { angleDiff, clampSym, pathItem } from "../utils";
import { RingItemBase } from "./ring-item-base";

export class RingMenu extends RingItemBase implements RadialMenuRing {
    public ringProps: RadialMenuRingProps;
    private selectedIndex: number = 0;
    private cursorAngle: number = NaN;
    private cursorAngleTarget: number = 0;
    private anglePerItem: number = 0;

    constructor(
        name: string,
        public items: RadialMenuItem[],
    ) {
        super(name);
        this.ringProps = {
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

    public updateRingProps(props: RadialMenuItemProps): void {
        this.ringProps = props;

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
        this.cursorAngleTarget = this.getCursorAngle(this.selectedIndex);

        if (isNaN(this.cursorAngle)) {
            this.cursorAngle = this.cursorAngleTarget;
        }
    }

    public updateItemProps(props: RadialMenuItemProps): void {
        this.itemProps = props;
    }

    public drawRing(contexts: Contexts, props: RadialMenuDrawProps): void {
        const ctx = contexts.background;

        pathItem(ctx, this.ringProps);
        ctx.fillStyle = props.theme.ringBg;
        ctx.fill();

        this.drawCursor(contexts.cursor, props);

        for (const item of this.items) {
            item.drawItem(contexts, props);
        }
    }

    private drawCursor(ctx: CanvasRenderingContext2D, props: RadialMenuDrawProps): void {
        const cursorProps: RadialMenuItemProps = {
            ...this.ringProps,
            startAngle: this.cursorAngle,
            endAngle: this.cursorAngle + this.anglePerItem,
        };

        if (angleDiff(this.cursorAngle, this.cursorAngleTarget) !== 0) {
            let delta: number;

            if (Math.abs(angleDiff(this.ringProps.startAngle, this.ringProps.endAngle)) < 0.001) {
                delta = angleDiff(this.cursorAngle, this.cursorAngleTarget);
            } else {
                delta = this.cursorAngleTarget - this.cursorAngle;
            }

            this.cursorAngle += clampSym(delta, props.delta * 0.01); // TODO: make this configurable
        }

        pathItem(ctx, cursorProps);

        ctx.fillStyle = props.theme.cursor;
        ctx.fill();
    }

    private getItemIndexAtAngle(angle: number): number | undefined {
        const itemCount = this.items.length;
        if (itemCount === 0) {
            return undefined;
        }

        const angleOffset = this.ringProps.startAngle;
        const anglePerItem = (this.ringProps.endAngle - this.ringProps.startAngle) / itemCount;

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
        return this.ringProps.startAngle + this.anglePerItem * index;
    }

    public onCenterClick(menu: RadialMenu): void {
        if (this.parent) {
            menu.setParentRing();
        }
    }

    public onRingHover(_menu: RadialMenu, angle: number, _distance: number): void {
        const index = this.getItemIndexAtAngle(angle);
        if (index !== undefined) {
            this.cursorAngleTarget = this.getCursorAngle(index);
            this.selectedIndex = index;
        }
    }

    public onRingClick(menu: RadialMenu, angle: number, _distance: number): void {
        const item = this.getItemAtAngle(angle);
        if (item) {
            item.onClick(menu);
        }
    }

    public drawItem(contexts: Contexts, props: RadialMenuDrawProps): void {
        super.drawItem(contexts, props);
    }

    public onClick(menu: RadialMenu): void {
        menu.setRing(this);
    }
}