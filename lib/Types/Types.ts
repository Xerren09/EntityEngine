/**
 * Used to represent 2D coordinates.
 */
export type vector2D = {
    x: number;
    y: number;
};

export type ReadonlyVector2D = {
    readonly x: number;
    readonly y: number;
};

/**
 * Used to represet rectangular dimensions. 
 */
export type rectSize = {
    width: number;
    height: number;
};

export type ReadonlyRectSize = {
    readonly width: number;
    readonly height: number;
};

/**
 * Used to represent a 2D circle
 */
export type circle2D = {
    position: vector2D;
    radius: number;
}

/**
 * Used to represent a 2D rectangle
 */
export type rect2D = {
    position: vector2D;
    vertices: vector2D[];
}

export type HexColor = `#${string}`;