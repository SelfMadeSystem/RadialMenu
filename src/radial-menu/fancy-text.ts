import { TextSize } from "./text-size";
import { Vec2 } from "./utils";

export type Icon = {
    path: Path2D;
    size: number;
    resizeTo: TextSize;
};

function getPixelSize(icon: Icon, radius: number): number {
    return icon.resizeTo.getTextSize(radius);
}

/**
 * Fancy text that can have an icon and a text.
 * 
 * P.S.: I'm very good at naming things.
 */
export class FancyText {
    private readonly text?: string;
    private readonly icon?: Icon;
    private readonly iconPlacement?: "left" | "right" | "top" | "bottom";

    constructor(text?: string, icon?: Icon, iconPlacement?: "left" | "right" | "top" | "bottom") {
        this.text = text;
        this.icon = icon;
        this.iconPlacement = iconPlacement;
    }

    /**
     * Draws the fancy text to the canvas.
     * 
     * @param ctx The canvas context to draw on.
     * @param pos The center position to draw the text at.
     * @param radius The radius of the ring.
     * @param textSize The size of the text.
     * @param font The font to use for the text.
     * @param textColor The color of the text.
     * @param iconColor The color of the icon.
     * @returns The rectangle that the text was drawn in.
     */
    public draw(ctx: CanvasRenderingContext2D, pos: Vec2, radius: number, textSize: number, font: string, textColor: string = "black", iconColor: string = "black"): DOMRect {
        const textWidth = this.text ? ctx.measureText(this.text).width : 0;
        const iconSize = this.icon ? getPixelSize(this.icon, radius) : textSize;

        const size = this.getSize(textWidth, textSize, iconSize);

        const topLeft = { x: pos.x - size.x / 2, y: pos.y - size.y / 2 };

        if (this.text) {
            ctx.font = `${textSize}px ${font}`;
            ctx.fillStyle = textColor;
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";

            const textPos = this.getTextPos(topLeft, textWidth, textSize, size);

            ctx.fillText(this.text, textPos.x, textPos.y);
        }

        if (this.icon) {
            ctx.fillStyle = iconColor;

            const iconPos = this.getIconPos(topLeft, iconSize, size);

            ctx.save();
            ctx.translate(iconPos.x, iconPos.y);
            let iconScale = iconSize / this.icon.size;
            ctx.scale(iconScale, iconScale);
            ctx.translate(-this.icon.size / 2, -this.icon.size / 2);
            ctx.fill(this.icon.path);
            ctx.restore();
        }

        return new DOMRect(topLeft.x, topLeft.y, size.x, size.y);
    }

    /**
     * Gets the rectangle that the text would be drawn in.
     * 
     * @param ctx The canvas context to draw on.
     * @param pos The center position to draw the text at.
     * @param radius The radius of the ring.
     * @param textSize The size of the text.
     * @param font The font to use for the text.
     * @param textColor The color of the text.
     * @param iconColor The color of the icon.
     * @returns The rectangle that the text was drawn in.
     */
    public getRect(ctx: CanvasRenderingContext2D, pos: Vec2, radius: number, textSize: number): DOMRect {
        const textWidth = this.text ? ctx.measureText(this.text).width : 0;
        const iconSize = this.icon ? getPixelSize(this.icon, radius) : textSize;

        const size = this.getSize(textWidth, textSize, iconSize);

        const topLeft = { x: pos.x - size.x / 2, y: pos.y - size.y / 2 };

        return new DOMRect(topLeft.x, topLeft.y, size.x, size.y);
    }

    private getSize(textWidth: number, textSize: number, iconSize: number): Vec2 {
        const size: Vec2 = { x: 0, y: 0 };

        if (this.text) {
            size.x = textWidth;
            size.y = textSize;
        }

        if (this.icon) {
            if (this.text) {
                switch (this.iconPlacement) {
                    case "left":
                    case "right":
                        size.x += iconSize;
                        size.y = Math.max(size.y, iconSize);
                        break;
                    case "top":
                    case "bottom":
                        size.x = Math.max(size.x, iconSize);
                        size.y += iconSize;
                        break;
                }
            } else {
                size.x += iconSize;
                size.y += iconSize;
            }
        }

        return size;
    }

    private getTextPos(topLeft: Vec2, textWidth: number, textSize: number, size: Vec2): Vec2 {
        const textPos: Vec2 = { x: topLeft.x, y: topLeft.y };

        if (this.icon) {
            switch (this.iconPlacement) {
                case "left":
                    textPos.x += size.x - textWidth / 2;
                    textPos.y += size.y / 2;
                    break;
                case "right":
                    textPos.x += textWidth / 2;
                    textPos.y += size.y / 2;
                    break;
                case "top":
                    textPos.x += size.x / 2;
                    textPos.y += size.y - textSize / 2;
                    break;
                case "bottom":
                    textPos.x += size.x / 2;
                    textPos.y += textSize / 2;
                    break;
            }
        } else {
            textPos.x += size.x / 2;
            textPos.y += size.y / 2;
        }

        return textPos;
    }

    private getIconPos(topLeft: Vec2, iconSize: number, size: Vec2): Vec2 {
        const iconPos: Vec2 = { x: topLeft.x, y: topLeft.y };

        if (this.text) {
            switch (this.iconPlacement) {
                case "left":
                    iconPos.x += iconSize / 2;
                    iconPos.y += size.y / 2;
                    break;
                case "right":
                    iconPos.x += size.x - iconSize / 2;
                    iconPos.y += size.y / 2;
                    break;
                case "top":
                    iconPos.x += size.x / 2;
                    iconPos.y += iconSize / 2;
                    break;
                case "bottom":
                    iconPos.x += size.x / 2;
                    iconPos.y += size.y - iconSize / 2;
                    break;
            }
        } else {
            iconPos.x += size.x / 2;
            iconPos.y += size.y / 2;
        }

        return iconPos;
    }
}