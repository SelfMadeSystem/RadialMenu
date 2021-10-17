// Bruh GitHub Copilot made this entire thing lmao
export class Vec2 {
    constructor(public readonly x = 0, public readonly y = 0) {
    }

    public static from(v: Vec2): Vec2 {
        return new Vec2(v.x, v.y);
    }

    public static fromArray(a: number[]): Vec2 {
        return new Vec2(a[0], a[1]);
    }

    public static fromObject(o: { x: number, y: number }): Vec2 {
        return new Vec2(o.x, o.y);
    }

    public static fromAngle(angle: number): Vec2 {
        return new Vec2(Math.cos(angle), Math.sin(angle));
    }

    public static fromAngleDeg(angle: number): Vec2 {
        return new Vec2(Math.cos(angle * Math.PI / 180), Math.sin(angle * Math.PI / 180));
    }

    public add(v: Vec2): Vec2 {
        return new Vec2(this.x + v.x, this.y + v.y);
    }

    public sub(v: Vec2): Vec2 {
        return new Vec2(this.x - v.x, this.y - v.y);
    }

    public mul(v: Vec2): Vec2 {
        return new Vec2(this.x * v.x, this.y * v.y);
    }

    public div(v: Vec2): Vec2 {
        return new Vec2(this.x / v.x, this.y / v.y);
    }

    public scale(s: number): Vec2 {
        return new Vec2(this.x * s, this.y * s);
    }

    public dot(v: Vec2): number {
        return this.x * v.x + this.y * v.y;
    }

    public cross(v: Vec2): number {
        return this.x * v.y - this.y * v.x;
    }

    public lerp(v: Vec2, t: number): Vec2 {
        return this.add(v.sub(this).scale(t));
    }

    public lengthSq(): number {
        return this.x * this.x + this.y * this.y;
    }

    public length(): number {
        return Math.sqrt(this.lengthSq());
    }

    public normalize(): Vec2 {
        return this.scale(1 / this.length());
    }

    public angle(): number {
        return Math.atan2(this.y, this.x);
    }

    public angleDeg(): number {
        return this.angle() * 180 / Math.PI;
    }

    public rotate(angle: number): Vec2 {
        return new Vec2(
            this.x * Math.cos(angle) - this.y * Math.sin(angle),
            this.x * Math.sin(angle) + this.y * Math.cos(angle)
        );
    }

    public rotateDeg(angle: number): Vec2 {
        return this.rotate(angle * Math.PI / 180);
    }

    public rotateAround(v: Vec2, angle: number): Vec2 {
        return this.sub(v).rotate(angle).add(v);
    }

    public rotateAroundDeg(v: Vec2, angle: number): Vec2 {
        return this.sub(v).rotateDeg(angle).add(v);
    }

    public distanceTo(v: Vec2): number {
        return this.sub(v).length();
    }

    public distanceToSq(v: Vec2): number {
        return this.sub(v).lengthSq();
    }

    public equals(v: Vec2): boolean {
        return this.x === v.x && this.y === v.y;
    }

    public toArray(): number[] {
        return [this.x, this.y];
    }

    public toObject(): { x: number, y: number } {
        return { x: this.x, y: this.y };
    }

    public toString(): string {
        return `Vec2(${this.x}, ${this.y})`;
    }

    public static zero(): Vec2 {
        return new Vec2(0, 0);
    }

    public static one(): Vec2 {
        return new Vec2(1, 1);
    }

    public static up(): Vec2 {
        return new Vec2(0, 1);
    }

    public static down(): Vec2 {
        return new Vec2(0, -1);
    }

    public static left(): Vec2 {
        return new Vec2(-1, 0);
    }

    public static right(): Vec2 {
        return new Vec2(1, 0);
    }
}
