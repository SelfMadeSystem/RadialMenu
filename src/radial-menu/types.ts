import type { Contexts, RadialMenu } from "./radial-menu";
import { TextSize } from "./text-size";
import { Vec2 } from "./utils";

export type RadialMenuTheme = {
    ringBg: string;
    ringText: string;
    cursor: string;
    // centerBg: string;
    centerText: string;
    textSize: TextSize;
    font: string;
    highlightOverlay: string;
    sliderBg: string;
    sliderFg: string;
};

export type RadialMenuProps = {
    theme?: Partial<RadialMenuTheme>;
    ringProps?: Partial<RadialMenuItemProps>;
    rootRing: RadialMenuRing;
};

export type RadialMenuDrawProps = {
    theme: RadialMenuTheme;
    delta: number;
    menu: RadialMenu;
    radius: number;
};

export type RadialMenuItemProps = {
    center: Vec2;
    outerRadius: number;
    innerRadius: number;
    startAngle: number;
    endAngle: number;
};

export type RadialMenuRingProps = RadialMenuItemProps;

export interface RadialMenuItem {
    /**
     * The parent ring of this item. Only the root ring has no parent.
     */
    parent?: RadialMenuRing;
    readonly itemProps: RadialMenuItemProps;

    /**
     * Updates the item props of this item.
     */
    updateItemProps(props: RadialMenuItemProps): void;

    /**
     * Draw the item on the canvas.
     * 
     * @param ctx The canvas context to draw on.
     * @param props The props to use for drawing.
     */
    drawItem(contexts: Contexts, props: RadialMenuDrawProps): void;

    /**
     * Gets called when the item is clicked.
     * 
     * @param menu The radial menu instance.
     */
    onClick(menu: RadialMenu): void;
}

export interface RadialMenuInput extends RadialMenuItem {
    /**
     * Gets called when the center is clicked.
     * 
     * @param menu The radial menu instance.
     */
    onCenterClick(menu: RadialMenu): void;

    /**
     * Gets called when the ring is hovered.
     * 
     * @param menu The radial menu instance.
     * @param angle The angle of the cursor.
     * @param distance The distance of the cursor from the center.
     * @param down Whether the mouse is down.
     */
    onRingHover?(menu: RadialMenu, angle: number, distance: number, down: boolean): void;

    /**
     * Gets called when the ring is clicked.
     * 
     * @param menu The radial menu instance.
     * @param angle The angle of the cursor.
     * @param distance The distance of the cursor from the center.
     */
    onRingClick?(menu: RadialMenu, angle: number, distance: number): void;

    /**
     * Gets called when the ring is unclicked.
     * 
     * @param menu The radial menu instance.
     * @param angle The angle of the cursor.
     * @param distance The distance of the cursor from the center.
     */
    onRingUnclick?(menu: RadialMenu, angle: number, distance: number): void;
}

export interface RadialMenuOverlay extends RadialMenuInput {
    /**
     * Draw the overlay on the canvas.
     * 
     * @param ctx The canvas context to draw on.
     */
    drawOverlay(contexts: Contexts, props: RadialMenuDrawProps): void;
}

export interface RadialMenuRing extends RadialMenuInput {
    readonly ringProps: RadialMenuRingProps;

    /**
     * Updates the ring props of this item.
     */
    updateRingProps(props: RadialMenuRingProps): void;

    /**
     * Draw the ring on the canvas.
     * 
     * @param ctx The canvas context to draw on.
     */
    drawRing(contexts: Contexts, props: RadialMenuDrawProps): void;
}