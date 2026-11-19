import type { ReadonlyVector2D, vector2D } from "../../../Types/Types.js"
import type Entity from "../../Entity.js"

/**
 * Defines the base for all colliders. They allow the engine to detect when two entities interact, when attached to one.
 * 
 * Colliders can be shared among multiple entities at the same time, and will be resolved individually for each entity's
 * position and rotation.
 */
export abstract class Collider {
    private _rectSize: vector2D = { x: 0, y: 0 };
    /**
     * The x and y of the shape's bounding box, regardless of rotation.
     */
    public get rectSize() : ReadonlyVector2D {
        return { ...this._rectSize };
    }
    public set rectSize(value) {
        this.setRectSize(value);
    }

    private _offset: vector2D = { x: 0, y: 0 };
    /**
     * The offset of the center of the collider from the attached entity's position.
     */
    public get offset(): ReadonlyVector2D {
        return { ...this._offset };
    }
    public set offset(value) {
        this.setOffset(value);
    }

    private _boundingCircleRadius: number = 0;
    /**
     * The radius of the collider's bounding circle. This is the smallest circle
     */
    public get boundingCircleRadius(): number {
        return this._boundingCircleRadius;
    }

    constructor(rect?: vector2D, offset?: vector2D) {
        if (rect)
            this.setRectSize(rect);
        if (offset)
            this.setOffset(offset);
    }

    /**
     * Sets the offset of the center of the collider from the attached Entity's position.
     * @param offset 
     */
    public setOffset(offset: vector2D) {
        this._offset = { ...offset };
    }

    /**
     * Sets the collider rect box size and bounding circle.
     * @param rect 
     */
    protected setRectSize(rect: vector2D) {
        this._rectSize = { ...rect };
        this._boundingCircleRadius = Math.hypot(this._rectSize.x, this._rectSize.y) / 2;
    }

    /**
     * Resolves the collider's shape with the given entity's position and rotation in mind.
     * @param a 
     */
    protected abstract resolve(a: Entity): any
}