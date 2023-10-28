import { RadialMenuColors, RadialMenuProps, RadialMenuRing, RadialMenuItemProps, RadialMenuRingProps } from ".";
import { wrapAngle } from "./utils";

export const defaultColors: RadialMenuColors = {
    ringBg: '#cccccf',
    ringText: '#000',
    cursor: '#0ae',
    // centerBg: '#0000',
    centerText: '#000',
    highlightOverlay: '#000a', // just darkens the rest of the ring
};


export class RadialMenu {
    public colors: RadialMenuColors;
    public currentRing: RadialMenuRing;
    public prevRing?: RadialMenuRing;
    public currentRingAmount: number = 1; // from 0 to 1. used for animations
    public rootRingProps: RadialMenuRingProps;

    private prevTime: number = 0;

    constructor(
        public readonly canvas: HTMLCanvasElement,
        props: RadialMenuProps,
    ) {
        this.colors = { ...defaultColors, ...props.colors };
        this.currentRing = props.rootRing;

        const radius = Math.min(canvas.width, canvas.height) / 2;
        let rootRingProps: RadialMenuRingProps = {
            center: { x: canvas.width / 2, y: canvas.height / 2 },
            outerRadius: radius,
            innerRadius: radius * 0.5,
            startAngle: -Math.PI * 0.5, // 12 o'clock
            endAngle: Math.PI * 1.5, // 12 o'clock, but the other way around
        };

        this.rootRingProps = {
            ...rootRingProps,
            ...props.ringProps,
        };

        this.currentRing.updateRingProps(this.rootRingProps);
    }

    public start() {
        this.canvas.addEventListener('pointermove', (e) => {
            this.onPointerMove(e);
        });
        this.canvas.addEventListener('pointerdown', (e) => {
            this.onPointerDown(e);
        });

        this.update();
    }

    public getCurrentItemProps(): RadialMenuItemProps {
        const { startAngle, endAngle } = this.rootRingProps;
        const angle = startAngle + (endAngle - startAngle) * this.currentRingAmount;

        return {
            ...this.rootRingProps,
            startAngle,
            endAngle: angle,
        };
    }

    public getPrevItemProps(): RadialMenuItemProps {
        const { startAngle, endAngle } = this.rootRingProps;
        const angle = startAngle + (endAngle - startAngle) * this.currentRingAmount;

        return {
            ...this.rootRingProps,
            startAngle: angle,
            endAngle,
        };
    }

    public setRing(ring: RadialMenuRing) {
        this.prevRing = this.currentRing;
        this.currentRing = ring;
        this.currentRingAmount = 0;
    }

    public draw(delta: number, drawPrev: boolean) {
        const ctx = this.canvas.getContext('2d');
        if (!ctx) {
            throw new Error('Could not get canvas context.');
        }

        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.currentRing.drawRing(ctx, { colors: this.colors, delta });

        if (drawPrev && this.prevRing) {
            this.prevRing.drawRing(ctx, { colors: this.colors, delta });
        }
    }

    public update() {
        const time = performance.now();
        if (!this.prevTime) {
            this.prevTime = time;
        }
        const delta = time - this.prevTime;

        let drawPrev = false;

        if (this.currentRingAmount < 1) {
            drawPrev = true;

            this.currentRingAmount += delta / 500; // TODO: make this configurable
            this.currentRingAmount = Math.min(this.currentRingAmount, 1);

            this.prevRing?.updateRingProps(this.getPrevItemProps());
            this.currentRing.updateRingProps(this.getCurrentItemProps());
        }

        this.draw(delta, drawPrev);
        this.prevTime = time;

        requestAnimationFrame(() => this.update());
    }

    private getPointerAngle(e: PointerEvent): number {
        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const angle = Math.atan2(y - this.rootRingProps.center.y, x - this.rootRingProps.center.x);
        return wrapAngle(angle, this.rootRingProps.startAngle);
    }

    private onPointerMove(e: PointerEvent) {
        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        if (this.currentRing.ringProps) {
            const { center, outerRadius, innerRadius, startAngle, endAngle } = this.currentRing.ringProps;
            const angle = this.getPointerAngle(e);

            if (angle >= startAngle && angle <= endAngle) {
                const distance = Math.sqrt((x - center.x) ** 2 + (y - center.y) ** 2);
                if (distance > innerRadius && distance < outerRadius) {
                    this.currentRing.onRingHover(this, angle, distance);
                }
            }
        }
    }

    private onPointerDown(e: PointerEvent) {
        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        if (this.currentRing.ringProps) {
            const { center, outerRadius, innerRadius, startAngle, endAngle } = this.currentRing.ringProps;
            const angle = this.getPointerAngle(e);

            if (angle >= startAngle && angle <= endAngle) {
                const distance = Math.sqrt((x - center.x) ** 2 + (y - center.y) ** 2);
                if (distance > innerRadius && distance < outerRadius) {
                    this.currentRing.onRingClick(this, angle, distance);
                } else if (distance <= innerRadius) {
                    this.currentRing.onCenterClick(this);
                }
            }
        }
    }
}