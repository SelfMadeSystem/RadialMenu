import React from "react";
import { Vec2 } from "../utils/vec2";

export interface CursorComponentProps {
    rotationOffset: number;
    cursorRotation: number;
    cursorSize: number;
}

export interface MenuComponentProps {   
    itemAngleSize: number;
    itemCount: number;
}

export interface RingComponentProps {
    innerRadius?: number;
    outerRadius?: number;
    ringWidth?: number;
}

export interface ViewportComponentProps {
    width: number;
    height: number;
    center: Vec2;
}

export interface ColorProps {
    fill: string;
    stroke?: string;
    strokeWidth?: number;
}

export interface ItemComponentProps extends CursorComponentProps, MenuComponentProps, RingComponentProps, ViewportComponentProps {
}

export interface Item {
    id: string;
    name: string;
    description: string;
    icon: string;
    onClick?: (item: Item, parent: Menu, event: React.MouseEvent<any, MouseEvent>) => void; // Opens a submenu if Item is a Menu
}

export interface Menu extends Item {
    ringColor?: ColorProps; // Uses default ring color if not specified
    cursorColor?: ColorProps; // Uses default cursor color if not specified
    itemAngleSize?: number; // Calculates angle size automatically via  360/items.length  if not specified
    ringSize?: RingComponentProps; // Uses default ring size if not specified
    items: Item[] | (() => Item[]); // Returns an array of items
}

export interface Options {
    ringColor: ColorProps;
    cursorColor: ColorProps;
    ringSize: RingComponentProps;
    rootMenu: Menu;
}

const defaultOptions: Options = {
    ringColor: {
        fill: "#cccccf",
        stroke: "#000",
        strokeWidth: 1,
    },
    cursorColor: {
        fill: "#0ae",
    },
    ringSize: {
        innerRadius: 30,
        outerRadius: 50,
        ringWidth: 20
    },
    rootMenu: {
        id: "root",
        name: "root",
        description: "root",
        icon: "",
        items: [
            {
                id: "root.1",
                name: "Item 1",
                description: "root.1",
                icon: "",
                onClick: (item: Item) => {
                    console.log(item.name);
                }
            },
            {
                id: "root.2",
                name: "Item 2",
                description: "root.2",
                icon: "",
                onClick: (item: Item) => {
                    console.log(item.name);
                }
            },
            {
                id: "root.3",
                name: "Item 3",
                description: "root.3",
                icon: "",
                onClick: (item: Item) => {
                    console.log(item.name);
                }
            },
            {
                id: "root.4",
                name: "Item 4",
                description: "root.4",
                icon: "",
                onClick: (item: Item) => {
                    console.log(item.name);
                }
            },
            {
                id: "root.5",
                name: "Item 5",
                description: "root.5",
                icon: "",
                onClick: (item: Item) => {
                    console.log(item.name);
                }
            },
            {
                id: "root.6",
                name: "Menu 6",
                description: "root.6",
                icon: "",
                onClick: (item: Item) => {
                    console.log(item.name);
                },
                itemAngleSize: 360 / 6,
                ringColor: {
                    fill: "#cccccf",
                    stroke: "#000",
                    strokeWidth: 1,
                },
                items: [
                    {
                        id: "root.6.1",
                        name: "Item 1",
                        description: "root.6.1",
                        icon: "",
                        onClick: (item: Item) => {
                            console.log(item.name);
                        }
                    },
                    {
                        id: "root.6.2",
                        name: "Item 2",
                        description: "root.6.2",
                        icon: "",
                        onClick: (item: Item) => {
                            console.log(item.name);
                        }
                    },
                ],
            } as Menu,
        ]
    }
};
