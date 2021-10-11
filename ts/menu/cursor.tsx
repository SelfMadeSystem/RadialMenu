import { MenuComponent, MenuComponentProps, ColorProps } from "./menuComponent";
import { annularSector } from "../utils/svgUtils";

export class Cursor extends MenuComponent<{
    info: MenuComponentProps,
    color: ColorProps
}> {
    render(): JSX.Element {
        const { info, color } = this.props;
        const { center, rotationOffset, cursorRotation, innerRadius, outerRadius, ringWidth, cursorSize } = info;
        const { fill, stroke, strokeWidth } = color;
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