import React from "react";
import { Menu, InfoComponentProps } from "../menuComponent";

export class ItemMenu extends React.Component<{
    menu: Menu;
    info: InfoComponentProps;
}, any> {
    constructor(props: any) {
        super(props);
    }

    render() {
        return (
            <g className="item-menu">
                {this.props.children}
            </g>
        );
    }
}