import { circle2D, vector2D } from "../../Types/Types.js";
import Entity from "../Entity.js";
import { RectCollider } from "./Colliders/Rectangle.js";
import { polyIntersect, circleIntersect, circlePolyIntersect } from "../../Math/Collision.js";

/**
 * **DO NOT EXPORT.**
 * 
 * Inlined enum for the resolver.
 */
const enum ResolverShapeTypes {
    Polygon = 1,
    Circle = 2
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

    const a_shape: vector2D[] | circle2D = a.Collider["resolve"](a);
    const b_shape: vector2D[] | circle2D = b.Collider["resolve"](b);

    const a_type = a.Collider instanceof RectCollider ? ResolverShapeTypes.Polygon : ResolverShapeTypes.Circle;
    const b_type = b.Collider instanceof RectCollider ? ResolverShapeTypes.Polygon : ResolverShapeTypes.Circle;

    if (a_type === ResolverShapeTypes.Polygon && b_type === ResolverShapeTypes.Polygon) {
        return polyIntersect(a_shape as vector2D[], b_shape as vector2D[]);
    }
    else if (a_type === ResolverShapeTypes.Circle && b_type === ResolverShapeTypes.Circle) {
        return circleIntersect(a_shape as circle2D, b_shape as circle2D);
    }
    else {
        // circle and rect
        const circle: circle2D = a_type === ResolverShapeTypes.Circle ? a_shape as circle2D : b_shape as circle2D;
        const rect: vector2D[] = a_type === ResolverShapeTypes.Polygon ? a_shape as vector2D[] : b_shape as vector2D[];
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

    const apos = a["_position"];
    const bpos = b["_position"];

    const x = (apos.x - bpos.x);
    const y = (apos.y - bpos.y);

    const distsqr = (x * x) + (y * y);
    const radsqr = (a_r + b_r) * (a_r + b_r);

    return (distsqr >= radsqr);
}