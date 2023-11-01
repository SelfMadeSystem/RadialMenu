
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
