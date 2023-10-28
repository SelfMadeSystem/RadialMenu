import { RadialMenuColors, RadialMenuProps, RadialMenuRing, RadialMenuItemProps } from ".";
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
    public rootItemProps: RadialMenuItemProps;

    private prevTime: number = 0;

    constructor(
        public readonly canvas: HTMLCanvasElement,
        props: RadialMenuProps,
    ) {
        this.colors = { ...defaultColors, ...props.colors };
        this.currentRing = props.rootRing;

        const radius = Math.min(canvas.width, canvas.height) / 2;
        let rootItemProps: RadialMenuItemProps = {
            center: { x: canvas.width / 2, y: canvas.height / 2 },
            outerRadius: radius,
            innerRadius: radius * 0.5,
            startAngle: -Math.PI * 0.5, // 12 o'clock
            endAngle: Math.PI * 1.5, // 12 o'clock, but the other way around
        };

        this.rootItemProps = {
            ...rootItemProps,
            ...props.itemProps,
        };

        this.currentRing.updateItemProps(this.rootItemProps);
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

    public setRing(ring: RadialMenuRing) {
        this.currentRing = ring;
        this.currentRing.updateItemProps(this.rootItemProps);
        // TODO: animate
    }

    public draw(delta: number) {
        const ctx = this.canvas.getContext('2d');
        if (!ctx) {
            throw new Error('Could not get canvas context.');
        }

        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.currentRing.drawRing(ctx, { colors: this.colors, delta });
    }

    public update() {
        const time = performance.now();
        if (!this.prevTime) {
            this.prevTime = time;
        }

        const delta = time - this.prevTime;
        this.draw(delta);
        this.prevTime = time;

        requestAnimationFrame(() => this.update());
    }

    private getPointerAngle(e: PointerEvent): number {
        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const angle = Math.atan2(y - this.rootItemProps.center.y, x - this.rootItemProps.center.x);
        return wrapAngle(angle, this.rootItemProps.startAngle);
    }

    private onPointerMove(e: PointerEvent) {
        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        if (this.currentRing.itemProps) {
            const { center, outerRadius, innerRadius, startAngle, endAngle } = this.currentRing.itemProps;
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

        if (this.currentRing.itemProps) {
            const { center, outerRadius, innerRadius, startAngle, endAngle } = this.currentRing.itemProps;
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