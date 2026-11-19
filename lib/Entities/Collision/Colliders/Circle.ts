import { Collider } from "./Collider.js";
import type { circle2D, vector2D } from "../../../Types/Types.js";
import type Entity from "../../Entity.js";
import { Vector2D } from "../../../Math/Vector2D.js";

/**
 * A simple circular collider. See {@link Collider} for more.
 */
export class CircleCollider extends Collider {
    private _radius: number = 5;
    public get radius() {
        return this._radius;
    }
    public set radius(value) {
        this.setRadius(value);
    }

    constructor(radius?: number, offset?: vector2D) {
        if (radius === undefined)
            radius = 5;
        const rect: vector2D = { x: radius * 2, y: radius * 2 };
        super(rect, offset);
        this.setRadius(radius);
    }

    /**
     * Sets the radius of the collision circle.
     * @param radius 
     */
    public setRadius(radius: number) {
        this._radius = radius;
        const rect: vector2D = { x: radius * 2, y: radius * 2 };
        this.setRectSize(rect);
    }

    protected resolve(a: Entity): circle2D {
        return {
            radius: this.radius,
            position: Vector2D.add(a["_position"], this.offset)
        }
    }
}