import { circle2D, rect2D } from "../../Types/Types.js";
import Entity from "../Entity.js";
import { RectCollider } from "./Colliders/Rectangle.js";
import { polyIntersect, circleIntersect, circlePolyIntersect } from "../../Math/Collision.js";

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

    const a_type = a.Collider instanceof RectCollider ? "rect" : "circle";
    const b_type = b.Collider instanceof RectCollider ? "rect" : "circle";

    if (a_type === "rect" && b_type === "rect") {
        // rect and rect
        return polyIntersect(a_shape, b_shape);
    }
    else if (a_type === "circle" && b_type === "circle") {
        // circle and circle
        return circleIntersect(a_shape, b_shape);
    }
    else {
        // circle and rect
        const circle: circle2D = a_type === "circle" ? a_shape : b_shape;
        const rect: rect2D = a_type === "rect" ? a_shape : b_shape;
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
    //const distance = Vector2D.distance(a.Position, b.Position);
    const a_r = a.Collider === undefined ? 0 : a.Collider["_boundingCircleRadius"];
    const b_r = b.Collider === undefined ? 0 : b.Collider["_boundingCircleRadius"];

    const x = (a.Position.x - b.Position.x);
    const y = (a.Position.y - b.Position.y);

    const distsqr = (x * x) + (y * y);
    const radsqr = (a_r + b_r) * (a_r + b_r);

    return (distsqr >= radsqr);
}