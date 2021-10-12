import { InfoComponentProps, ColorProps, CursorComponentProps } from "./menuComponent";
import { annularSector } from "../utils/svgUtils";
import React from "react";

export class Cursor extends React.Component<{
    info: InfoComponentProps,
    cursorInfo: CursorComponentProps,
}> {
    render(): JSX.Element {
        const { info, cursorInfo } = this.props;
        const { center, rotationOffset, innerRadius, outerRadius, ringWidth } = info;
        const { cursorColor, cursorSize, cursorRotation } = cursorInfo;
        const { fill, stroke, strokeWidth } = cursorColor;
        return <path className="cursor" d={annularSector({
            centerX: center.x,
            centerY: center.y,
            startAngle: -cursorSize / 2 + cursorRotation + rotationOffset ,
            endAngle: cursorSize / 2 + cursorRotation + rotationOffset,
            innerRadius: innerRadius,
            outerRadius: outerRadius,
            thickness: ringWidth
        })} fill={fill} stroke={stroke} strokeWidth={strokeWidth}></path>;
    }    
}