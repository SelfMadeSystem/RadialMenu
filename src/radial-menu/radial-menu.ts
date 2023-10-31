import { RadialMenuTheme, RadialMenuProps, RadialMenuRing, RadialMenuRingProps, RadialMenuOverlay, RadialMenuInput, RadialMenuDrawProps, RadialMenuItemProps } from ".";
import { TextSizeRel } from "./text-size";
import { wrapAngle } from "./utils";

export const defaultColors: RadialMenuTheme = {
    ringBg: '#cccccf',
    ringText: '#000',
    cursor: '#0ae',
    // centerBg: '#0000',
    centerText: '#000',
    textSize: TextSizeRel(25 / 500),
    font: 'sans-serif',
    highlightOverlay: '#000a', // just darkens the rest of the ring
    sliderBg: '#555',
    sliderFg: '#0ae',
    sliderWidth: TextSizeRel(25 / 500),
};

export type Canvases = {
    background: HTMLCanvasElement;
    cursor: HTMLCanvasElement;
    foreground: HTMLCanvasElement;
    overlayBg: HTMLCanvasElement;
    overlayCursor: HTMLCanvasElement;
    overlayFg: HTMLCanvasElement;
};

export type Contexts = {
    background: CanvasRenderingContext2D;
    cursor: CanvasRenderingContext2D;
    foreground: CanvasRenderingContext2D;
    overlayBg: CanvasRenderingContext2D;
    overlayCursor: CanvasRenderingContext2D;
    overlayFg: CanvasRenderingContext2D;
};

function getContexts(canvases: Canvases): Contexts {
    return {
        background: canvases.background.getContext('2d')!,
        cursor: canvases.cursor.getContext('2d')!,
        foreground: canvases.foreground.getContext('2d')!,
        overlayBg: canvases.overlayBg.getContext('2d')!,
        overlayCursor: canvases.overlayCursor.getContext('2d')!,
        overlayFg: canvases.overlayFg.getContext('2d')!,
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

    return canvas;
}

export class RadialMenu {
    public colors: RadialMenuTheme;
    public currentRing: RadialMenuRing;
    public prevRing?: RadialMenuRing;
    public currentOverlay?: RadialMenuOverlay;
    public currentInput: RadialMenuInput;
    public animateCurrentRingAmount: number = 1; // from 0 to 1. used for animations
    public animateCurrentRingOtherDirection: boolean = false;
    public rootRingProps: RadialMenuRingProps;
    public canvases: Canvases;

    private prevTime: number = 0;

    private requestAnimationFrame: number = 0;

    private createCanvases(props: RadialMenuProps) {
        const redraw = () => {
            cancelAnimationFrame(this.requestAnimationFrame);

            this.update();
        };
        const background = createCanvas();
        const cursor = createCanvas();
        const foreground = createCanvas();
        const overlayBg = createCanvas();
        const overlayCursor = createCanvas();
        const overlayFg = createCanvas();

        this.app.appendChild(background);
        this.app.appendChild(cursor);
        this.app.appendChild(foreground);
        this.app.appendChild(overlayBg);
        this.app.appendChild(overlayCursor);
        this.app.appendChild(overlayFg);

        new ResizeObserver(() => {
            const canvas = this.canvases.background;
            const width = canvas.clientWidth;
            const height = canvas.clientHeight;
            background.width = cursor.width = foreground.width = overlayBg.width = overlayCursor.width = overlayFg.width = width;
            background.height = cursor.height = foreground.height = overlayBg.height = overlayCursor.height = overlayFg.height = height;

            new ResizeObserver(() => {
                const radius = Math.min(canvas.width, canvas.height) / 2;
                let rootRingProps: RadialMenuItemProps = {
                    ...this.rootRingProps,
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

            redraw();
        }).observe(this.app);

        return { background, cursor, foreground, overlayBg, overlayCursor, overlayFg };
    }

    constructor(
        public readonly app: HTMLElement,
        props: RadialMenuProps,
    ) {
        this.colors = { ...defaultColors, ...props.theme };
        this.currentInput = this.currentRing = props.rootRing;

        this.canvases = this.createCanvases(props);

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
        const props: RadialMenuDrawProps = { theme: this.colors, delta, menu: this, radius: this.rootRingProps.outerRadius };
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

        this.requestAnimationFrame = requestAnimationFrame(() => this.update());
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