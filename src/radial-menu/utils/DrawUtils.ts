import type { RadialMenuItemProps } from "..";
import { Vec2 } from "./Vec2";

/**
 * Paths out the item props on a canvas.
 * 
 * @param ctx The canvas context to draw on.
 * @param props The props to use for drawing.
 */
export function pathItem(ctx: CanvasRenderingContext2D, props: RadialMenuItemProps) {
    ctx.beginPath();
    ctx.arc(props.center.x, props.center.y, props.outerRadius, props.startAngle, props.endAngle);
    ctx.arc(props.center.x, props.center.y, props.innerRadius, props.endAngle, props.startAngle, true);
    ctx.closePath();
}

/**
 * Gets the position to draw the text at.
 * 
 * Assumes that the text is centered horizontally and vertically.
 */
export function getTextPosition(props: RadialMenuItemProps): Vec2 {
    const angle = props.startAngle + (props.endAngle - props.startAngle) / 2;
    const radius = (props.innerRadius + props.outerRadius) / 2;

    const x = props.center.x + Math.cos(angle) * radius;
    const y = props.center.y + Math.sin(angle) * radius;

    return { x, y };
}
