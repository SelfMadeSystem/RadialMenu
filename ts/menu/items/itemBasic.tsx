import React from "react";
import { Item, ItemComponentProps } from "../menuComponent";
import { ItemMenu } from "./itemMenu";

export class ItemBasic extends React.Component<{
    item: Item;
    info: ItemComponentProps;
    index: number;
    parent: ItemMenu;
}, any> {
    render() {
        const { item, info, index, parent } = this.props;
        const { icon, onClick } = item;
        const { center, itemAngleSize, itemCount, innerRadius, outerRadius, ringWidth, rotationOffset } = info;
        const centerRadius = innerRadius + (ringWidth) / 2;
        const x = center.x + centerRadius * Math.cos(rotationOffset + itemAngleSize * index);
        const y = center.y + centerRadius * Math.sin(rotationOffset + itemAngleSize * index);
        return (
            <image className="menu-item" x={x} y={y} width={itemCount * itemAngleSize} height={itemAngleSize} onClick={(e) => onClick(item, parent.props.menu, e)} />
        );
    }
}