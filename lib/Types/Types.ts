import type Entity from "../Entities/Entity";

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
 * Used to represent a 2D circle
 */
export type circle2D = {
    position: vector2D;
    radius: number;
}

export type HexColor = `#${string}`;

/**
 * Describes an axis aligned bounding box.
 * The first vector is the box's center coordinates, the second half width and height of the box.
 */
export type AABB = [vector2D, vector2D];

/**
 * An attribute applied to this specific entity. Attributes are designed to be unique and not shared between objects.
 */
export interface IEntityAttribute {
    /**
     * The entity this attribute applies to.
     */
    readonly entity: Entity;
    /**
     * Customs tags used to find this attribute easier.
     */
    tags: string[];
    /**
     * Called when the attached entity's position or rotation is changed.
     */
    onTransformChange(): void;
}