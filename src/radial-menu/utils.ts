import type { RadialMenuItemProps } from ".";

export type Vec2 = { x: number, y: number; };

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
 */
export function getTextPosition(props: RadialMenuItemProps, text: string, ctx: CanvasRenderingContext2D): Vec2 {
    const textWidth = ctx.measureText(text).width;
    const textHeight = ctx.measureText("M").width;

    const angle = props.startAngle + (props.endAngle - props.startAngle) / 2;
    const radius = (props.innerRadius + props.outerRadius) / 2;

    const x = props.center.x + Math.cos(angle) * radius - textWidth / 2;
    const y = props.center.y + Math.sin(angle) * radius + textHeight / 2;

    return { x, y };
}

/**
 * Clamps a number between two values.
 */
export function clamp(value: number, min: number, max: number): number {
    return Math.min(Math.max(value, min), max);
}

/**
 * Clamps a number between a value and negative value.
 */
export function clampSym(value: number, max: number): number {
    return clamp(value, -max, max);
}

/**
 * Modulo that always returns a positive number.
 */
export function posvmod(value: number, mod: number): number {
    return ((value % mod) + mod) % mod;
}

/**
 * Linearly interpolates between two values.
 */
export function lerp(from: number, to: number, t: number): number {
    return from + (to - from) * t;
}

/**
 * Wraps a number between two values.
 */
export function wrap(value: number, min: number, max: number): number {
    return posvmod(value - min, max - min) + min;
}

/**
 * Wraps a number to be between 0 and 2 * PI, along with a given offset.
 */
export function wrapAngle(angle: number, offset: number = 0): number {
    return wrap(angle - offset, 0, 2 * Math.PI) + offset;
}

/**
 * Gets the shortest angle between two angles.
 * 
 * Positive is clockwise, negative is counter-clockwise.
 */
export function angleDiff(from: number, to: number): number {
    return wrapAngle(to - from, -Math.PI);
}

/**
 * Determines if an angle is between two other angles (inclusive and shortest).
 */
export function angleBetween(angle: number, from: number, to: number): boolean {
    return angleDiff(from, angle) >= 0 && angleDiff(angle, to) >= 0;
}
