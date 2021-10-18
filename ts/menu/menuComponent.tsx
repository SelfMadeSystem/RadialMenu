import React from "react";
import { Vec2 } from "../utils/vec2";
import { ItemBasic } from "./items/itemBasic";
import { ItemMenu } from "./items/itemMenu";

export interface CursorComponentProps {
    cursorRotation: number;
    cursorSize: number;
    cursorColor: ColorProps;
    cursorScale: number;
}

export interface MenuComponentProps {
    itemAngleSize: number;
    itemCount: number;
}

export interface RingComponentProps {
    innerRadius: number;
    outerRadius: number;
    ringWidth: number;
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

export interface InfoComponentProps extends MenuComponentProps, RingComponentProps, ViewportComponentProps {
    rotationOffset: number;
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
    items: Item[] | ((menu: Menu) => Item[]); // Returns an array of items
}

export interface Options {
    ringColor: ColorProps;
    cursorColor: ColorProps;
    ringSize: RingComponentProps;
    rootMenu: Menu;
}

export const defaultOptions: Options = {
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
                icon: "/img/menu/location-item.svg",
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
                icon: "/img/menu/airplane-item.svg",
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

export function generateProps(opt: Options, width: number, height: number, menu?: Menu): InfoComponentProps {
    if (menu == undefined) {
        menu = opt.rootMenu;
    }
    return {
        rotationOffset: (!menu.itemAngleSize ? 180 / menu.items.length : menu.itemAngleSize / 2) - 90,
        itemAngleSize: !menu.itemAngleSize ? 360 / menu.items.length : menu.itemAngleSize,
        itemCount: menu.items.length,
        innerRadius: opt.ringSize.innerRadius,
        outerRadius: opt.ringSize.outerRadius,
        ringWidth: opt.ringSize.ringWidth,
        width: width,
        height: height,
        center: new Vec2(width / 2, height / 2),
    };
}

export function generateComponents(menu: Menu, info: InfoComponentProps): JSX.Element {
    let items: JSX.Element[] = [];
    if (menu.items instanceof Function) {
        let itemCount = 0;
        items = menu.items(menu).map((item: Item) => {
            return generateItem(item, info, itemCount++, menu);
        });
    } else {
        items = menu.items.map((item: Item, index: number) => {
            return generateItem(item, info, index, menu);
        });
    }

    return <g>
        <ItemMenu key={menu.id} menu={menu} info={info}>
            {items}
        </ItemMenu>
    </g>;
}

function generateItem(item: Item, info: InfoComponentProps, index: number, menu: Menu): JSX.Element {
    return <ItemBasic key={item.id} item={item} info={info} index={index} parent={menu} />;
}