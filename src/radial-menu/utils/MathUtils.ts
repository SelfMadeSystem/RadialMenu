
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

/**
 * Determines the shortest distance between two values given a wrap.
 */
export function distanceWrap(from: number, to: number, min: number, max: number): number {
    const wrapDiff = max - min;
    return wrap(to - from, -wrapDiff / 2, wrapDiff / 2);
}

/**
 * The function `signedPow` calculates the power of a number while preserving its
 * sign.
 */
export function signedPow(value: number, pow: number): number {
    return Math.pow(Math.abs(value), pow) * Math.sign(value);
}

/**
 * Gets the distance between two values given optional wrap.
 */
export function distanceOptWrap(from: number, to: number, wrapNums?: [min: number, max: number]): number {
    if (wrapNums) {
        return distanceWrap(from, to, wrapNums[0], wrapNums[1]);
    } else {
        return to - from;
    }
}

/**
 * Optionally wrap a number between two values.
 */
export function wrapOpt(value: number, wrapNums?: [min: number, max: number]): number {
    if (wrapNums) {
        return wrap(value, wrapNums[0], wrapNums[1]);
    } else {
        return value;
    }
}
