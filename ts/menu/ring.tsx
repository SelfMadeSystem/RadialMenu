import { ColorProps, MenuComponent, MenuComponentProps } from "./menuComponent";
import { annularSector } from "../utils/svgUtils";

export class Ring extends MenuComponent<{
    info: MenuComponentProps,
    color: ColorProps
}> {
    render(): JSX.Element {
        const { info, color } = this.props;
        const { center, innerRadius, outerRadius, ringWidth } = info;
        const { fill, stroke, strokeWidth } = color;
        return <path className="ring" d={annularSector({
            centerX: center.x,
            centerY: center.y,
            startAngle: 0,
            endAngle: 360,
            innerRadius: innerRadius,
            outerRadius: outerRadius,
            thickness: ringWidth
        })} fill={fill} stroke={stroke} strokeWidth={strokeWidth}></path>;
    }    
}