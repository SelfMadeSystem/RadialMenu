import { RadialMenuColors, RadialMenuProps, RadialMenuRing, RadialMenuRingProps, RadialMenuOverlay, RadialMenuInput } from ".";
import { wrapAngle } from "./utils";

export const defaultColors: RadialMenuColors = {
    ringBg: '#cccccf',
    ringText: '#000',
    cursor: '#0ae',
    // centerBg: '#0000',
    centerText: '#000',
    highlightOverlay: '#000a', // just darkens the rest of the ring
    sliderBg: '#0ae',
    sliderFg: '#000',
};

export type Canvases = {
    background: HTMLCanvasElement;
    cursor: HTMLCanvasElement;
    foreground: HTMLCanvasElement;
    overlay: HTMLCanvasElement;
};

export type Contexts = {
    background: CanvasRenderingContext2D;
    cursor: CanvasRenderingContext2D;
    foreground: CanvasRenderingContext2D;
    overlay: CanvasRenderingContext2D;
};

function getContexts(canvases: Canvases): Contexts {
    return {
        background: canvases.background.getContext('2d')!,
        cursor: canvases.cursor.getContext('2d')!,
        foreground: canvases.foreground.getContext('2d')!,
        overlay: canvases.overlay.getContext('2d')!,
    };
}

function clearCanvases(canvases: Canvases) {
    for (const canvas of Object.values(canvases)) {
        const ctx = canvas.getContext('2d');
        if (!ctx) {
            throw new Error('Could not get canvas context.');
        }
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
}

function createCanvas() {
    const canvas = document.createElement('canvas');
    canvas.style.position = 'absolute';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';

    new ResizeObserver(() => {
        canvas.width = canvas.clientWidth;
        canvas.height = canvas.clientHeight;
    }).observe(canvas);

    return canvas;
}

export class RadialMenu {
    public colors: RadialMenuColors;
    public currentRing: RadialMenuRing;
    public prevRing?: RadialMenuRing;
    public currentOverlay?: RadialMenuOverlay;
    public currentInput: RadialMenuInput;
    public animateCurrentRingAmount: number = 1; // from 0 to 1. used for animations
    public animateCurrentRingOtherDirection: boolean = false;
    public rootRingProps: RadialMenuRingProps;
    public canvases: Canvases;

    private prevTime: number = 0;

    private createCanvases() {
        const background = createCanvas();
        const cursor = createCanvas();
        const foreground = createCanvas();
        const overlay = createCanvas();

        this.app.appendChild(background);
        this.app.appendChild(cursor);
        this.app.appendChild(foreground);
        this.app.appendChild(overlay);

        return { background, cursor, foreground, overlay };
    }

    constructor(
        public readonly app: HTMLElement,
        props: RadialMenuProps,
    ) {
        this.colors = { ...defaultColors, ...props.colors };
        this.currentInput = this.currentRing = props.rootRing;

        this.canvases = this.createCanvases();

        const canvas = this.canvases.background;

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


        if (!props.ringProps?.center) {
            new ResizeObserver(() => {
                const radius = Math.min(canvas.width, canvas.height) / 2;
                rootRingProps = {
                    ...rootRingProps,
                    center: { x: canvas.width / 2, y: canvas.height / 2 },
                    outerRadius: radius,
                    innerRadius: radius * 0.5,
                };

                this.rootRingProps = {
                    ...rootRingProps,
                    ...props.ringProps,
                };

                this.currentRing.updateRingProps(this.rootRingProps);
            }).observe(canvas);
        }
    }

    public start() {
        this.app.addEventListener('pointermove', (e) => {
            this.onPointerMove(e);
        });
        this.app.addEventListener('pointerdown', (e) => {
            this.onPointerDown(e);
        });
        this.app.addEventListener('pointerup', (e) => {
            this.onPointerUp(e);
        });

        this.update();
    }

    public getCurrentRingProps(): RadialMenuRingProps {
        const { startAngle, endAngle } = this.rootRingProps;
        if (this.animateCurrentRingOtherDirection) {
            const angle = endAngle + (startAngle - endAngle) * this.animateCurrentRingAmount;

            return {
                ...this.rootRingProps,
                startAngle: angle,
                endAngle,
            };
        } else {
            const angle = startAngle + (endAngle - startAngle) * this.animateCurrentRingAmount;

            return {
                ...this.rootRingProps,
                startAngle,
                endAngle: angle,
            };
        }
    }

    public getPrevRingProps(): RadialMenuRingProps {
        const { startAngle, endAngle } = this.rootRingProps;
        if (this.animateCurrentRingOtherDirection) {
            const angle = endAngle + (startAngle - endAngle) * this.animateCurrentRingAmount;

            return {
                ...this.rootRingProps,
                startAngle,
                endAngle: angle,
            };
        } else {
            const angle = startAngle + (endAngle - startAngle) * this.animateCurrentRingAmount;

            return {
                ...this.rootRingProps,
                startAngle: angle,
                endAngle,
            };
        }
    }

    public setRing(ring: RadialMenuRing) {
        this.prevRing = this.currentRing;
        this.currentRing = ring;
        this.currentInput = ring;
        this.animateCurrentRingAmount = 0;
        this.animateCurrentRingOtherDirection = false;
    }

    public setParentRing() {
        if (this.currentRing.parent) {
            this.setRing(this.currentRing.parent);
            this.animateCurrentRingOtherDirection = true;
        }
    }

    public setOverlay(overlay: RadialMenuOverlay) {
        this.currentOverlay = overlay;
        this.currentInput = overlay;
    }

    public unsetOverlay() {
        this.currentOverlay = undefined;
        this.currentInput = this.currentRing;
    }

    public draw(delta: number, drawPrev: boolean) {
        clearCanvases(this.canvases);
        const contexts = getContexts(this.canvases);
        const props = { colors: this.colors, delta, menu: this };
        this.currentRing.drawRing(contexts, props);

        if (drawPrev && this.prevRing) {
            this.prevRing.drawRing(contexts, props);
        }

        if (this.currentOverlay) {
            this.currentOverlay.drawOverlay(contexts, props);
        }
    }

    public update() {
        const time = performance.now();
        if (!this.prevTime) {
            this.prevTime = time;
        }
        const delta = time - this.prevTime;

        let drawPrev = false;

        if (this.animateCurrentRingAmount < 1) {
            drawPrev = true;

            this.animateCurrentRingAmount += delta / 500; // TODO: make this configurable
            this.animateCurrentRingAmount = Math.min(this.animateCurrentRingAmount, 1);

            this.prevRing?.updateRingProps(this.getPrevRingProps());
            this.currentRing.updateRingProps(this.getCurrentRingProps());
        }

        this.draw(delta, drawPrev);
        this.prevTime = time;

        requestAnimationFrame(() => this.update());
    }

    private getPointerAngle(e: PointerEvent): number {
        const rect = this.app.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const angle = Math.atan2(y - this.rootRingProps.center.y, x - this.rootRingProps.center.x);
        return wrapAngle(angle, this.rootRingProps.startAngle);
    }

    private getInputRingProps(): RadialMenuRingProps {
        if ("ringProps" in this.currentInput) {
            return this.currentInput.ringProps as RadialMenuRingProps ?? this.currentRing.ringProps;
        }

        return this.currentRing.ringProps;
    }

    private onPointerMove(e: PointerEvent) {
        if (!this.currentInput.onRingHover) {
            return;
        }

        const rect = this.app.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const ringProps = this.getInputRingProps();

        if (ringProps) {
            const { center, outerRadius, innerRadius, startAngle, endAngle } = ringProps;
            const angle = this.getPointerAngle(e);

            if (angle >= startAngle && angle <= endAngle) {
                const distance = Math.sqrt((x - center.x) ** 2 + (y - center.y) ** 2);
                if (distance > innerRadius && distance < outerRadius) {
                    this.currentInput.onRingHover(this, angle, distance, e.buttons === 1);
                }
            }
        }
    }

    private onPointerDown(e: PointerEvent) {
        const rect = this.app.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const ringProps = this.getInputRingProps();

        if (ringProps) {
            const { center, outerRadius, innerRadius, startAngle, endAngle } = ringProps;
            const angle = this.getPointerAngle(e);

            if (angle >= startAngle && angle <= endAngle) {
                const distance = Math.sqrt((x - center.x) ** 2 + (y - center.y) ** 2);
                if (distance > innerRadius && distance < outerRadius) {
                    if (this.currentInput.onRingClick)
                        this.currentInput.onRingClick(this, angle, distance);
                } else if (distance <= innerRadius) {
                    this.currentInput.onCenterClick(this);
                }
            }
        }
    }

    private onPointerUp(e: PointerEvent) {
        if (!this.currentInput.onRingUnclick) {
            return;
        }

        const rect = this.app.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const ringProps = this.getInputRingProps();

        if (ringProps) {
            const { center, outerRadius, innerRadius, startAngle, endAngle } = ringProps;
            const angle = this.getPointerAngle(e);

            if (angle >= startAngle && angle <= endAngle) {
                const distance = Math.sqrt((x - center.x) ** 2 + (y - center.y) ** 2);
                if (distance > innerRadius && distance < outerRadius) {
                    this.currentInput.onRingUnclick(this, angle, distance);
                }
            }
        }
    }
}