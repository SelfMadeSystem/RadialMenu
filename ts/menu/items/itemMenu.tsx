import React from "react";
import { Menu, ItemComponentProps } from "../menuComponent";

export class ItemMenu extends React.Component<{
    menu: Menu;
    info: ItemComponentProps;
}, any> {
    constructor(props: any) {
        super(props);
    }

    render() {
        return (
            <g className="itemMenu">
                {this.props.children}
            </g>
        );
    }
}