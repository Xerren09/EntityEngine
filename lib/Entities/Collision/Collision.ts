import { EntityManager } from "../Entities.js";
import { circle2D, rect2D, vector2D } from "../../Types/Types.js";
import Entity from "../Entity.js";
import { Vector2D } from "../Math/Vector2D.js";

/**
 * Gets the list of Entities with the given tag(s) that are overlapping the specified Entity.
 * @param self The main Entity we are testing against.
 * @param tags The tags that are used for filtering. Only one must apply to an Entity in order to be tested.
 */
export function GetCollisionsByTag(entities: EntityManager, self: Entity, tags: string[]): Array<Entity> {
    let collisionObjects: Entity[] = [];
    for (const target of entities.List) {
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
 */
export function polyIntersect(self: rect2D, target: rect2D) : boolean {
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
            if (lineIntersect(a, b, c, d)) {
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
 * @returns 
 */
export function __isLeft(a: vector2D, b: vector2D, c: vector2D): boolean {
    const first = (b.x - a.x) * (c.y - a.y);
    const second = (b.y - a.y) * (c.x - a.x);
    return (first > second);
}

/**
 * Checks if a line segment AB and CD intersects.
 * ```
 *       *B
 *      /
 * C*--*---*D
 *    /
 *   /
 * A*
 * ```
 */
export function lineIntersect(a: vector2D, b: vector2D, c: vector2D, d: vector2D): boolean {
    return (__isLeft(a, c, d) != __isLeft(b, c, d)) && (__isLeft(a, b, c) != __isLeft(a, b, d));
}


/**
 * Checks if a polygon ABCD and a circle E,r intersects.
 * ```
 * A*--------*B
 *  |        |
 *  |        |
 *  |      /-+-\
 *  |     /  |  \
 * D*----+---*C  |
 *        \  E  /
 *         \___/
 * ```
 */
export function circlePolyIntersect(a: circle2D, b: rect2D) {
    let isInsideRect: boolean = true;
    let isWithinRadius: boolean = false;

    for (let index = 0; index < b.vertices.length; index++) {
        const current = b.vertices[index];
        const next = b.vertices[(index + 1) % b.vertices.length];
        if (isInsideRect == true && __isLeft(current, next, a.position) == true) {
            isInsideRect = false;
        }
        const dist = distanceToSegment(current, next, a.position);
        if (dist < a.radius) {
            //console.log(current, next, a.position);
            isWithinRadius = true;
            break;
        }
    }
    return (isWithinRadius);
}

/**
 * Gets the distance between a line segment AB and point C.
 * ```
 *       *B
 *      /
 * C*  /
 *    /
 *   /
 * A*
 * ```
 * @param a 
 * @param b 
 * @param c 
 * @returns 
 */
export function distanceToSegment(a: vector2D, b: vector2D, c: vector2D) : number {
    var lineVector = Vector2D.vector(a, b);
    var pointVector = Vector2D.vector(a, c);
    var segmentLength = Vector2D.magnitude(lineVector);
    var line_unitvec = Vector2D.normalise(lineVector);
    var pnt_vec_scaled = Vector2D.scale(pointVector, 1.0/segmentLength);
    var t = Vector2D.dot(line_unitvec, pnt_vec_scaled);
    if (t < 0.0) {
        t = 0;
    }
    else if (t > 1.0) {
        t = 1.0;
    }
    var nearest = Vector2D.scale(lineVector, t);
    var dist = Vector2D.distance(nearest, pointVector);
    return dist;
}

/**
 * Checks if two circles overlap.
 * @param a 
 * @param b 
 * @returns 
 */
export function circleIntersect(a: circle2D, b: circle2D) : boolean {
    if (Vector2D.equals(a.position, b.position)) {
        return true;
    }
    // Get distance between this and target
    const vectorLength = Vector2D.distance(a.position, b.position);
    return (vectorLength < (a.radius + b.radius));
}

