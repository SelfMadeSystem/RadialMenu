import React from "react";
import { toRad } from "../../utils/mathUtils";
import { Item, Menu, InfoComponentProps } from "../menuComponent";
import { ItemMenu } from "./itemMenu";

export class ItemBasic extends React.Component<{
    item: Item;
    info: InfoComponentProps;
    index: number;
    parent: Menu;
}, any> {
    render() {
        const { item, info, index, parent } = this.props;
        const { name, icon, onClick } = item;
        const { center, itemAngleSize, itemCount, innerRadius, outerRadius, ringWidth, rotationOffset } = info;
        const centerRadius = innerRadius + (ringWidth) / 2;
        const x = center.x + centerRadius * Math.cos(toRad(rotationOffset + itemAngleSize * index));
        const y = center.y + centerRadius * Math.sin(toRad(rotationOffset + itemAngleSize * index));
        const size = outerRadius - innerRadius;
        const iconSize = size * 0.5;
        return (
            <g className="item-basic">
                {icon &&
                    <image x={x - iconSize / 2} y={y - iconSize * 0.8} width={iconSize} height={iconSize} xlinkHref={icon} />}
                <text x={x} y={y + (icon ? iconSize*0.4 : 0)} textAnchor="middle" alignmentBaseline="central" fontSize={size * (icon ? 0.2 : 0.3)}>{name}</text>
            </g>
        );
    }
}