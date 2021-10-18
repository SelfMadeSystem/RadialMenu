import { InfoComponentProps, ColorProps, CursorComponentProps } from "./menuComponent";
import { annularSector } from "../utils/svgUtils";
import React from "react";
import { Vec2 } from "../utils/vec2";
import { approx, clamp, lerp, mod, rotDiff } from "../utils/mathUtils";

class CursorInfo {
    center: Vec2;
    innerRadius: number;
    outerRadius: number;
    ringWidth: number;
    annularAngle: number;
    rotation: number;
    scale: number;
    fill: string;
    stroke: string;
    strokeWidth: number;
    path: string;
    get transform() {
        return `translate(${this.center.x}px, ${this.center.y}px) rotate(${this.rotation}deg)`;
    }

    clone() {
        var clone = new CursorInfo();
        clone.center = this.center;
        clone.innerRadius = this.innerRadius;
        clone.outerRadius = this.outerRadius;
        clone.ringWidth = this.ringWidth;
        clone.annularAngle = this.annularAngle;
        clone.rotation = this.rotation;
        clone.scale = this.scale;
        clone.fill = this.fill;
        clone.stroke = this.stroke;
        clone.strokeWidth = this.strokeWidth;
        clone.path = this.path;
        return clone;
    }

    equals(other: CursorInfo) {
        return this.center.equals(other.center) &&
            this.innerRadius === other.innerRadius &&
            this.outerRadius === other.outerRadius &&
            this.ringWidth === other.ringWidth &&
            this.annularAngle === other.annularAngle &&
            this.rotation === other.rotation && 
            this.scale === other.scale/* &&
            this.fill === other.fill &&
            this.stroke === other.stroke &&
            this.strokeWidth === other.strokeWidth &&
            this.path === other.path */;
    }

    approxEquals(other: CursorInfo) {
        return approx(this.center.x, other.center.x) &&
            approx(this.center.y, other.center.y) &&
            approx(this.innerRadius, other.innerRadius) &&
            approx(this.outerRadius, other.outerRadius) &&
            approx(this.ringWidth, other.ringWidth) &&
            approx(this.annularAngle, other.annularAngle) &&
            approx(rotDiff(this.rotation, other.rotation), 0) &&
            approx(this.scale, other.scale) /* &&
            this.fill === other.fill &&
            this.stroke === other.stroke &&
            this.strokeWidth === other.strokeWidth &&
            this.path === other.path */;
    }
}

export class Cursor extends React.Component<{
    info: InfoComponentProps,
    cursorInfo: CursorComponentProps,
}> {
    at: CursorInfo = undefined;
    to: CursorInfo = new CursorInfo();
    recalcPath: boolean = true;

    render(): JSX.Element {
        const { cursorInfo } = this.props;
        const { cursorColor } = cursorInfo;
        const { fill, stroke, strokeWidth } = cursorColor;
        const path = this.getPath()
        const { transform } = this.at;
        return <path className="cursor" d={path} fill={fill} stroke={stroke} strokeWidth={strokeWidth} style={{ transform: transform }}></path>;
    }

    getPath(): string {
        this.resetPath();
        return this.at.path;
    }

    calcPath(info: CursorInfo): string {
        const inside = info.innerRadius + info.ringWidth / 2;
        return annularSector({
            centerX: 0,
            centerY: 0,
            startAngle: -(info.annularAngle * info.scale) / 2,
            endAngle: (info.annularAngle * info.scale) / 2,
            innerRadius: inside - info.ringWidth * info.scale/2,
            outerRadius: inside + info.ringWidth * info.scale/2,
        })
    }

    resetPath(): void {
        const { info, cursorInfo } = this.props;
        this.updateValues(info, cursorInfo);
        if (this._shouldRecalcPath()) {
            this.recalcPath = false;
            this.at.path = this.calcPath(this.at);
            this.beginAnimation();
        }
    }

    updateValues(info: InfoComponentProps, cursorInfo: CursorComponentProps): void {
        const { center, rotationOffset, innerRadius, outerRadius, ringWidth } = info;
        const { cursorColor, cursorSize, cursorRotation, cursorScale } = cursorInfo;
        const { fill, stroke, strokeWidth } = cursorColor;
        this.to.center = center;
        this.to.innerRadius = innerRadius;
        this.to.outerRadius = outerRadius;
        this.to.ringWidth = ringWidth;
        this.to.annularAngle = cursorSize;
        this.to.rotation = cursorRotation + rotationOffset;
        this.to.scale = cursorScale;
        this.to.fill = fill;
        this.to.stroke = stroke;
        this.to.strokeWidth = strokeWidth;
        if (this.at === undefined) {
            this.at = this.to.clone();
        }
    }

    _shouldRecalcPath(): boolean {
        if (this.recalcPath || this.to.path === undefined) {
            return true;
        }
        const { innerRadius, outerRadius, ringWidth } = this.props.info;
        const { cursorSize, cursorScale } = this.props.cursorInfo;
        if (innerRadius !== this.to.innerRadius || outerRadius !== this.to.outerRadius || ringWidth !== this.to.ringWidth || cursorSize !== this.to.annularAngle || cursorScale !== this.to.scale) {
            return true;
        }
        return false;
    }

    _id: number;
    _lastFrame: number;
    beginAnimation() {
        if (this._id) cancelAnimationFrame(this._id);
        this._id = requestAnimationFrame(this.animate);
    }

    animate = (timestamp: number) => {
        if (!this._lastFrame) {
            this._lastFrame = timestamp;
        }
        const delta = timestamp - this._lastFrame;
        this._lastFrame = timestamp;
        this.update(delta);
        if (!this.at.approxEquals(this.to)) {
            this.forceUpdate();
        }
        this.beginAnimation();
    }

    update(delta: number) {
        const t = Math.min(delta / 1000, 1);
        const { center: toCenter, innerRadius: toInnerRadius, outerRadius: toOuterRadius, ringWidth: toRingWidth, annularAngle: toAnnularAngle, rotation: toRotation, scale: toScale } = this.to;
        const { center: atCenter, innerRadius: atInnerRadius, outerRadius: atOuterRadius, ringWidth: atRingWidth, annularAngle: atAnnularAngle, rotation: atRotation, scale: atScale } = this.at;
        this.at.center = atCenter.lerp(toCenter, t);
        this.at.innerRadius = lerp(atInnerRadius, toInnerRadius, t);
        this.at.outerRadius = lerp(atOuterRadius, toOuterRadius, t);
        this.at.ringWidth = lerp(atRingWidth, toRingWidth, t);
        this.at.annularAngle = lerp(atAnnularAngle, toAnnularAngle, Math.min(delta / 250, 1));
        this.at.rotation = mod(clamp(rotDiff(atRotation, toRotation) * Math.min(t * 5, 1), -delta, delta) + atRotation, 360);
        this.at.scale = lerp(atScale, toScale, Math.min(delta / 250, 1));
        // this.at.fill = lerpColor(fill, toFill, t);
        // this.at.stroke = lerpColor(stroke, toStroke, t);
        this.at.strokeWidth = lerp(this.at.strokeWidth, this.to.strokeWidth, t);
    }
}