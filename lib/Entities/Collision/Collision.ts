import { Entities } from "../Entities.js";
import { ReadonlyVector2D, rect2d, vector2D } from "../../Types/Types.js";
import Entity from "../Entity.js";
import { Collider } from "./Colliders/index.js";
import { RectCollider } from "./Colliders/Rectangle.js";

/**
 * Gets the list of Entities with the given tag(s) that are overlapping the specified Entity.
 * @param self The main Entity we are testing against.
 * @param tags The tags that are used for filtering. Only one must apply to an Entity in order to be tested.
 */
export function GetCollisionsByTag(self: Entity, tags: string[]): Array<Entity> {
    let collisionObjects: Entity[] = [];
    for (const target of Entities.List) {
        const isMatching = tags.some(tag => target.Tags.includes(tag));
        if (isMatching) {
            // We need to check both self -> target, and target -> self
            // because in some cases (target is bigger than self) it's possible for vertices not be inside self or target
            /*if (isOverlapping(self.Vertices, target.Vertices) || isOverlapping(target.Vertices, self.Vertices))
            {
                collisionObjects.push(target);
            }*/
        }
    }
    return collisionObjects;
}


/**
 * Given two polygons ABCD and EFGH:
 * ```
 * A*--------*B
 *  |        |
 *  |        |
 *  |    E*--+--*F
 *  |     |  |  |
 * D*-----+--*C |
 *        |     |
 *       H*-----*G
 * ```
 * Checks if any edges intersect or if any vertex of EFGH is within ABCD.
 * 
 * This works for all convex polygons, regardless of vertex count. Vertices do however need to be declared **clockwise.**
 * 
 * @param self 
 * @param target 
 * @returns 
 */
export function __overlap(self: rect2d, target: rect2d) {
    const selfCount = self.vertices.length;
    const targetCount = target.vertices.length;
    for (let tv_index = 0; tv_index < targetCount; tv_index++) {
        const c = target.vertices[tv_index];
        const d = target.vertices[(tv_index + 1) % targetCount];
        let isPointWithinSelf = true;
        let doEdgesIntersect = false;
        for (let sv_index = 0; sv_index < selfCount; sv_index++) {
            const a = self.vertices[sv_index];
            const b = self.vertices[(sv_index + 1) % selfCount];
            if (lineInterect(a, b, c, d)) {
                doEdgesIntersect = true;
                break;
            }
            if (__isLeft(a, b, c) == false) {
                isPointWithinSelf = false;
                break;
            }
        }
        if (isPointWithinSelf || doEdgesIntersect) {
            return true;
        }
    }
    return false;
}

//Checks if {@link c} is to the left side of the line formed by {@link a} and {@link b}.
/**
 * Given a line segment AB, and a point C:
 * 
 * ```
 *       *B
 *      /
 *  C* /
 *    /
 *   /
 * A*
 * ```
 * 
 * Checks if C is to the left side of the line.
 * @param a 
 * @param b 
 * @param c 
 * @returns 
 */
export function __isLeft(a: vector2D, b: vector2D, c: vector2D): boolean {
    const first = (b.x - a.x) * (c.y - a.y);
    const second = (b.y - a.y) * (c.x - a.x);
    return (first > second);
}

function lineInterect(a: vector2D, b: vector2D, c: vector2D, d: vector2D): boolean {
    return (__isLeft(a, c, d) != __isLeft(b, c, d)) && (__isLeft(a, b, c) != __isLeft(a, b, d));
}