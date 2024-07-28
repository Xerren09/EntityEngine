import { circle2D, ReadonlyRectSize, ReadonlyVector2D, rect2D, rectSize, vector2D } from "../../../Types/Types.js"
import Entity from "../../Entity.js"
import { Distance, Vector2D } from "../../Math/Vector2D.js";
import { circleIntersect, circlePolyIntersect, polyIntersect } from "../Collision.js";
import { CircleCollider } from "./Circle.js";
import { RectCollider } from "./Rectangle.js";

/**
 * Defines the base for all colliders.
 */
export abstract class Collider {
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
    protected setRectSize(rect: rectSize) {
        this._rectSize = { ...rect };
        this._boundingCircleRadius = Math.hypot(this._rectSize.width, this._rectSize.height) / 2;
    }

    /**
     * Resolves the collider's shape with the given entity's position and rotation in mind.
     * @param a 
     */
    protected abstract resolve(a: Entity): any
}

/**
 * Checks if two entities collide.
 * @param a 
 * @param b 
 * @returns 
 */
export function CollisionResolver(a: Entity, b: Entity) : boolean {
    if (b.Collider === undefined || a.Collider === undefined)
        return false;

    if (canSkipIntersectionCheck(a, b))
        return false;

    const a_shape = a.Collider["resolve"](a);
    const b_shape = b.Collider["resolve"](b);

    if (a.Collider instanceof RectCollider && b.Collider instanceof RectCollider) {
        // rect and rect
        return polyIntersect(a_shape, b_shape);
    }
    else if (a.Collider instanceof CircleCollider && b.Collider instanceof CircleCollider) {
        // circle and circle
        return circleIntersect(a_shape, b_shape);
    }
    else {
        // circle and rect
        const circle: circle2D = a.Collider instanceof CircleCollider ? a_shape : b_shape;
        const rect: rect2D = a.Collider instanceof RectCollider ? a_shape : b_shape;
        return circlePolyIntersect(circle, rect);
    }
}

/**
 * Checks if collision detection can be skipped. This only ensures the two colliders are not intersecting.
 * @param a 
 * @param b 
 * @returns 
 */
function canSkipIntersectionCheck(a: Entity, b: Entity): boolean {
    const distance = Distance(a.Position, b.Position);
    const a_r = a.Collider === undefined ? 0 : a.Collider["_boundingCircleRadius"];
    const b_r = b.Collider === undefined ? 0 : b.Collider["_boundingCircleRadius"];
    return (distance >= (a_r + b_r));
}