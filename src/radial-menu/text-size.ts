export interface TextSize {
    /**
     * Gets the size of the text in pixels given the radius of the radial menu.
     * @param radius The radius of the radial menu.
     * @returns The size of the text in pixels.
     */
    getTextSize(radius: number): number;
}

export function TextSizeAbs(size: number): TextSize {
    return {
        getTextSize: () => size
    };
}

export function TextSizeRel(size: number): TextSize {
    return {
        getTextSize: (radius) => radius * size
    };
}
