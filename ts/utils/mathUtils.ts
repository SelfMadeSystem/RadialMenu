export function mod(a: number, b: number): number {
    return ((a % b) + b) % b;
}

export function clamp(value: number, min: number, max: number): number {
    return Math.min(Math.max(value, min), max);
}

export function lerp(a: number, b: number, t: number): number {
    return a + (b - a) * t;
}

export function rotDiff(a: number, b: number): number {
    const diff = mod(b - a, 360);
    return diff > 180 ? diff - 360 : diff;
}

export function toDeg(rad: number): number {
    return rad * 180 / Math.PI;
}

export function toRad(deg: number): number {
    return deg * Math.PI / 180;
}