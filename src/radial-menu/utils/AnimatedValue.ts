import { clampSym, distanceOptWrap, signedPow, wrapOpt } from "./MathUtils";

export type AnimateFunction = (currentValue: number, targetValue: number, speed: number, deltaTime: number, wrapNums: [min: number, max: number] | undefined) => number;

export const linearAnimate: AnimateFunction = (currentValue, targetValue, speed, deltaTime, wrapNums) => {
    const delta = distanceOptWrap(currentValue, targetValue, wrapNums);
    const maxDelta = speed * deltaTime;

    const w = wrapOpt(currentValue + clampSym(delta, maxDelta), wrapNums);
    return w;
};

export const smoothAnimate: AnimateFunction = (currentValue, targetValue, speed, deltaTime, wrapNums) => {
    const delta = distanceOptWrap(currentValue, targetValue, wrapNums) * speed * deltaTime;

    return wrapOpt(currentValue + signedPow(delta, 0.9), wrapNums);
};

/**
 * An animated value that can be used to animate the radial menu.
 */
export class AnimatedValue {
    public currentValue: number;
    public targetValue: number;
    public animateSpeed: number;
    public animateFunction: AnimateFunction;
    public wrapNums?: [min: number, max: number];
    public epsilon: number;

    /**
     * Creates a new animated value.
     * @param initialValue The initial value.
     * @param speed The speed of the animation.
     * @param animateFunction The function to use to animate the value.
     * @param wrapMin The minimum value to wrap to.
     * @param wrapMax The maximum value to wrap to.
     * @param epsilon The epsilon to use when comparing values. Use NaN to disable.
     */
    constructor(initialValue: number, speed: number, animateFunction: AnimateFunction = linearAnimate, wrapNum?: [min: number, max: number], epsilon?: number) {
        this.currentValue = initialValue;
        this.targetValue = initialValue;
        this.animateSpeed = speed;
        this.animateFunction = animateFunction;
        this.wrapNums = wrapNum;
        this.epsilon = epsilon ?? 0.0001;
    }

    /**
     * Updates the animated value.
     * @param deltaTime The time since the last update.
     */
    public update(deltaTime: number): void {
        this.currentValue = this.animateFunction(this.currentValue, this.targetValue, this.animateSpeed, deltaTime, this.wrapNums);

        if (this.reachedApprox()) {
            this.currentValue = this.targetValue;
        }
    }

    /**
     * Gets the current value.
     */
    public getValue(): number {
        return this.currentValue;
    }

    /**
     * Sets the target value.
     */
    public setTarget(value: number): void {
        this.targetValue = value;
    }

    /**
     * Sets the current value to the target value.
     */
    public snap(): void {
        this.currentValue = this.targetValue;
    }

    /**
     * Sets both the current and target values.
     */
    public setBoth(value: number): void {
        this.currentValue = this.targetValue = value;
    }

    /**
     * Gets the difference between the current and target values.
     */
    public getDiff(): number {
        return this.targetValue - this.currentValue;
    }

    /**
     * Returns true if we reached the target value.
     */
    public reached(): boolean {
        return this.currentValue === this.targetValue;
    }

    /**
     * Returns true if we have an epsilon and the difference between the current and target values is less than the epsilon.
     */
    public reachedApprox(): boolean {
        return !isNaN(this.epsilon) && Math.abs(this.getDiff()) < this.epsilon;
    }
}