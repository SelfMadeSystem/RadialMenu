import React from "react";
import { Vec2 } from "../utils/vec2";

export abstract class MenuComponent<P extends {info: MenuComponentProps } = {info: MenuComponentProps }, S = {}> extends React.Component<P, S> {
    abstract render(): JSX.Element;
}

export interface CursorComponentProps {
    rotationOffset: number;
    cursorRotation: number;
    cursorSize: number;
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

export interface MenuComponentProps extends CursorComponentProps, RingComponentProps, ViewportComponentProps {
}