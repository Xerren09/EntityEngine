import { ReadonlyRectSize, ReadonlyVector2D, rectSize, vector2D } from "../../../Types/Types.js"
import Entity from "../../Entity.js"
import { Distance } from "../../Math/Vector2D.js";

export abstract class Collider {
    protected _parent: Entity;
    private _rectSize: rectSize = { width: 0, height: 0 };
    /**
     * The width and height of the shape's bounding box, regardless of rotation.
     */
    public get rectSize() : ReadonlyRectSize {
        return { ...this._rectSize };
    }

    private _offset: vector2D = { x: 0, y: 0 };
    /**
     * The offset of the center of the collider from the attached Entity's position.
     */
    public get offset(): ReadonlyVector2D {
        return { ...this._offset };
    }

    public get position(): vector2D {
        return {
            x: this._parent.Position.x + this.offset.x,
            y: this._parent.Position.y + this.offset.y
        };
    }

    private _boundingCircleRadius: number = 0;
    /**
     * The radius of the collider's bounding circle. This is the smallest circle
     */
    public get boundingCircleRadius(): number {
        return this._boundingCircleRadius;
    }

    constructor(rect?: rectSize, offset?: vector2D) {
        if (rect)
            this.setRectSize(rect);
        if (offset)
            this.setOffset(offset);
    }

    public setOffset(offset: vector2D) {
        this._offset = { ...offset };
    }

    public setRectSize(rect: rectSize) {
        this._rectSize = { ...rect };
        this._boundingCircleRadius = Math.hypot(this._rectSize.width, this._rectSize.height) / 2;
    }

    /**
     * Checks if collision detection can be skipped. This only ensures the two colliders are not intersecting.
     * @param self 
     * @param target 
     * @param radius 
     * @returns 
     */
    protected canSkipIntersectionCheck(target: Collider): boolean {
        const distance = Distance(this._parent.Position, target.position);
        return (distance >= (this._boundingCircleRadius + target._boundingCircleRadius));
    }

    public abstract isIntersecting(target: Entity): boolean

    public abstract resolve(): any
}