import { InfoComponentProps, ColorProps, CursorComponentProps } from "./menuComponent";
import { annularSector } from "../utils/svgUtils";
import React from "react";
import { Vec2 } from "../utils/vec2";

export class Cursor extends React.Component<{
    info: InfoComponentProps,
    cursorInfo: CursorComponentProps,
}> {
    center: Vec2;
    innerRadius: number;
    outerRadius: number;
    ringWidth: number;
    annularAngle: number;
    rotation: number;
    fill: string;
    stroke: string;
    strokeWidth: number;
    path: string;
    transformRotation: string;
    transformPosition: Vec2;
    get transform () {
        return `translate(${this.transformPosition.x}px, ${this.transformPosition.y}px) rotate(${this.transformRotation})`;
    }

    render(): JSX.Element {
        const { cursorInfo } = this.props;
        const { cursorColor } = cursorInfo;
        const { fill, stroke, strokeWidth } = cursorColor;
        return <path className="cursor" d={this.getPath()} fill={fill} stroke={stroke} strokeWidth={strokeWidth} style={{transform: this.transform}}></path>;
    }

    getPath(): string {
        this.resetPath();
        return this.path;
    }

    resetPath(): void {
        const { info, cursorInfo } = this.props;
        const howToUpdate = this._getHowToUpdatePath();
        this.updateValues(info, cursorInfo);
        switch (howToUpdate) {
            case 1:
                this.moveCursor(this.center);
                break;
            case 3:
                this.moveCursor(this.center);
            case 2:
                this.rotateCursor(this.rotation);
                break;
            case 4:
                this.path = annularSector({
                    centerX: 0,
                    centerY: 0,
                    startAngle: -this.annularAngle / 2,
                    endAngle: this.annularAngle / 2,
                    innerRadius: this.innerRadius,
                    outerRadius: this.outerRadius,
                    thickness: this.ringWidth
                })
                this.rotateCursor(this.rotation);
                this.moveCursor(this.center);
                break;
        }
    }

    updateValues(info: InfoComponentProps, cursorInfo: CursorComponentProps): void {
        const { center, rotationOffset, innerRadius, outerRadius, ringWidth } = info;
        const { cursorColor, cursorSize, cursorRotation } = cursorInfo;
        const { fill, stroke, strokeWidth } = cursorColor;
        this.center = center;
        this.innerRadius = innerRadius;
        this.outerRadius = outerRadius;
        this.ringWidth = ringWidth;
        this.annularAngle = cursorSize;
        this.rotation = cursorRotation + rotationOffset;
        this.fill = fill;
        this.stroke = stroke;
        this.strokeWidth = strokeWidth;
    }

    rotateCursor(rotation: number): void {
        this.rotation = rotation;
        this.transformRotation = `${rotation}deg`;
    }

    moveCursor(position: Vec2): void {
        this.transformPosition = position;
    }

    // Gets the most efficient way to update the path
    // 0. Don't update          No changes
    // 1. Move path             Only the center changed
    // 2. Rotate path           Only the rotation changed (either cursor rotation or rotation offset)
    // 3. Rotate and move path  Both the center and rotation changed
    // 4. Update everything     Radius changed or path not defined
    _getHowToUpdatePath(): number {
        if (this.path === undefined) {
            return 4;
        }
        const { center, innerRadius, outerRadius, ringWidth } = this.props.info;
        const { cursorSize, cursorRotation } = this.props.cursorInfo;
        if (innerRadius !== this.innerRadius || outerRadius !== this.outerRadius || ringWidth !== this.ringWidth || cursorSize !== this.annularAngle) {
            return 4;
        }
        var centerChanged = center.x !== this.center.x || center.y !== this.center.y;
        var rotationChanged = cursorRotation !== this.rotation;
        if (centerChanged && rotationChanged) {
            return 3;
        }
        if (centerChanged) {
            return 1;
        }
        if (rotationChanged) {
            return 2;
        }
        return 0;
    }

    /*
    _id: number | NodeJS.Timer;
    animateCursor() {
        if (this._id) clearInterval(this._id as NodeJS.Timer);
        this._id = setInterval(() => {
            this.setState(state => {
                const { currentCursor, toCursor } = state;
                const { cursorRotation, cursorSize } = currentCursor;
                const { cursorRotation: toCursorRotation, cursorSize: toCursorSize } = toCursor;
                const newCursorRotation = mod(clamp(rotDiff(cursorRotation, toCursorRotation) / 6, -5, 5) + cursorRotation, 360);
                const newCursorSize = cursorSize + (toCursorSize - cursorSize) / 8;
                return {
                    currentCursor: {
                        cursorRotation: newCursorRotation,
                        cursorSize: newCursorSize,
                        cursorColor: { fill: "#0ae" },
                    }
                }
            })
            const { currentCursor, toCursor } = this.state;
            if (approx(currentCursor.cursorRotation, toCursor.cursorRotation, 0.01) && approx(currentCursor.cursorSize, toCursor.cursorSize)) {
                clearInterval(this._id as NodeJS.Timer);
            }
        }, 1000 / 60);
    }*/
}