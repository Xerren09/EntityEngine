import { Collider } from "./index.js";
import { ReadonlyVector2D, circle2D, rect2D, rectSize, vector2D } from "../../../Types/Types.js";
import Entity from "../../Entity.js";
import { Distance, Equals, Subtract, Vector2D } from "../../Math/Vector2D.js";
import { RectCollider } from "./Rectangle.js";
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

    public setRadius(radius: number) {
        this._radius = radius;
        const rect: rectSize = { width: radius * 2, height: radius * 2 };
        this.setRectSize(rect);
    }
    
    public isIntersecting(target: Entity): boolean {
        if (target.Collider === undefined)
            return false;

        if (this.canSkipIntersectionCheck(target.Collider))
            return false;

        const selfCircle = this.resolve();
        
        if (target.Collider instanceof CircleCollider) {
            if (Equals(this.position, target.Position))
                return true;

            const collider = target.Collider as CircleCollider;
            const targetCircle = collider.resolve();
            return checkCircleIntersect(targetCircle, selfCircle);
        }
        
        if (target.Collider instanceof RectCollider) {
            const collider = target.Collider as RectCollider;
            const rect = collider.resolve();
            return checkCircleRectIntersect(selfCircle, rect);
        }
        return false;
    }

    public resolve() : circle2D {
        return {
            radius: this.radius,
            position: Vector2D.rotate(this._parent.Position, this.position, this._parent.Rotation)
        }
    }
}

function checkCircleIntersect(a: circle2D, b: circle2D): boolean {
    if (Equals(a.position, b.position)) {
        return true;
    }
    // Get distance between this and target
    const vectorLength = Distance(a.position, b.position);
    if (vectorLength < (a.radius + b.radius)) {
        return true;
    }
    return false;
}

function checkCircleRectIntersect(a: circle2D, b: rect2D): boolean {
    let isInsideRect: boolean = true;
    let isWithinRadius: boolean = false;
    for (let index = 0; index < b.vertices.length; index++) {
        const current = b.vertices[index];
        const next = b.vertices[(index + 1) % b.vertices.length];
        if (isInsideRect == true && __isLeft(current, next, a.position) == true) {
            isInsideRect = false;
        }
        const dist = distToSegment(a.position, current, next)//pDistance(a.position, current, next);
        if (dist < a.radius) {
            console.log(current, next, a.position);
            isWithinRadius = true;
            break;
        }
    }
    return (isWithinRadius);
}

function dist2(v: vector2D, w: vector2D) {
    return Math.pow(v.x - w.x, 2) + Math.pow(v.y - w.y, 2)
}
function distToSegmentSquared(p: vector2D, v: vector2D, w: vector2D) {
    var l2 = dist2(v, w);
    if (l2 == 0)
        return dist2(p, v);
    var t = ((p.x - v.x) * (w.x - v.x) + (p.y - v.y) * (w.y - v.y)) / l2;
    t = Math.max(0, Math.min(1, t));
    return dist2(p, {
        x: v.x + t * (w.x - v.x),
        y: v.y + t * (w.y - v.y)
    });
}
function distToSegment(p: vector2D, v: vector2D, w: vector2D) {

    return Math.sqrt(distToSegmentSquared(p, v, w));
}