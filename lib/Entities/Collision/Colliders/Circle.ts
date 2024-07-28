import { Collider } from "./Collider.js";
import { circle2D, rectSize, vector2D } from "../../../Types/Types.js";
import Entity from "../../Entity.js";
import { Vector2D } from "../../Math/Vector2D.js";
import { __isLeft } from "../Collision.js";

export type CircleShape = ReadonlyArray<circle2D>;

export class CircleCollider extends Collider {
    private _radius: number = 5;
    public get radius() {
        return this._radius;
    }

    constructor(radius?: number, offset?: vector2D) {
        if (radius === undefined)
            radius = 5;
        const rect: rectSize = { width: radius * 2, height: radius * 2 };
        super(rect, offset);
        this.setRadius(radius);
    }

    /**
     * Sets the radius of the collision circle.
     * @param radius 
     */
    public setRadius(radius: number) {
        this._radius = radius;
        const rect: rectSize = { width: radius * 2, height: radius * 2 };
        this.setRectSize(rect);
    }

    protected resolve(a: Entity): circle2D {
        return {
            radius: this.radius,
            position: Vector2D.rotate(a.Position, Vector2D.add(a.Position, this.offset), a.Rotation)
        }
    }
}