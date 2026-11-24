import type { circle2D, vector2D } from "../Types/Types.js";
import { Vector2D } from "./Vector2D.js";

/**
 * Checks if two simple plygons whose vertices are declared clockwise intersect. 
 * 
 * ### Example:
 * 
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
 */
export function polyIntersect(self: vector2D[], target: vector2D[]) : boolean {
    const selfCount = self.length;
    const targetCount = target.length;
    for (let tv_index = 0; tv_index < targetCount; tv_index++) {
        const c = target[tv_index];
        const d = target[(tv_index + 1) % targetCount];
        let isPointWithinSelf = true;
        let doEdgesIntersect = false;
        for (let sv_index = 0; sv_index < selfCount; sv_index++) {
            const a = self[sv_index];
            const b = self[(sv_index + 1) % selfCount];
            if (lineIntersect(a, b, c, d)) {
                doEdgesIntersect = true;
                break;
            }
            if (isLeftOfLine(a, b, c) == false) {
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
 * Given a line segment V->W and point P, checks if P is to the left side of the line:
 * 
 * ### Example:
 * 
 * ```
 *       *W
 *      /
 *  P* /
 *    /
 *   /
 * V*
 * ```
 * @returns 
 */
export function isLeftOfLine(v: vector2D, w: vector2D, p: vector2D): boolean {
    const first = (w.x - v.x) * (p.y - v.y);
    const second = (w.y - v.y) * (p.x - v.x);
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
    return (isLeftOfLine(a, c, d) !== isLeftOfLine(b, c, d)) && (isLeftOfLine(a, b, c) !== isLeftOfLine(a, b, d));
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
export function circlePolyIntersect(a: circle2D, b: vector2D[]): boolean {
    let isInsideRect: boolean = true;
    let isWithinRadius: boolean = false;
    const radius2 = a.radius * a.radius;
    for (let index = 0; index < b.length; index++) {
        const current = b[index];
        const next = b[(index + 1) % b.length];
        if (isInsideRect === true && isLeftOfLine(current, next, a.position) === false) {
            isInsideRect = false;
        }
        const dist2 = distanceToSegmentSquared(current, next, a.position);
        if (dist2 < radius2) {
            isWithinRadius = true;
            break;
        }
    }
    return (isInsideRect || isWithinRadius);
}

/**
 * Gets the exact distance between the line segment V->W and point P.
 * @param v The start coordinate of the line segment.
 * @param w The end coordinate of the line segment.
 * @param p The point to measure distance from.
 * @returns The distance between P and V->W.
 */
export function distanceToSegment(v: vector2D, w: vector2D, p: vector2D): number {
    return Math.sqrt(distanceToSegmentSquared(v, w, p));
}

/**
 * Gets the distance squared between the line segment V->W and point P.
 * @param v The start coordinate of the line segment.
 * @param w The end coordinate of the line segment.
 * @param p The point to measure distance from.
 * @returns The distance squared between P and V->W.
 */
export function distanceToSegmentSquared(v: vector2D, w: vector2D, p: vector2D): number {
    const lineLengthSquared = Vector2D.distanceSquared(v, w);
    if (lineLengthSquared === 0) {
        return Vector2D.distanceSquared(p, v);
    }
    let dx = (w.x - v.x);
    let dy = (w.y - v.y);
    const t = ((p.x - v.x) * dx + (p.y - v.y) * dy) / lineLengthSquared;
    if (t <= 0) {
        return Vector2D.distanceSquared(p, v);
    }
    else if (t >= 1) {
        return Vector2D.distanceSquared(p, w);
    }
    dx = v.x + t * dx;
    dy = v.y + t * dy;
    dx = p.x - dx;
    dy = p.y - dy;
    return (dx * dx) + (dy * dy);
}

/**
 * Checks if two circles overlap.
 */
export function circleIntersect(a: circle2D, b: circle2D): boolean {
    const x = (a.position.x - b.position.x);
    const y = (a.position.y - b.position.y);

    const ar = a.radius;
    const br = b.radius;
    
    const distsqr = (x * x) + (y * y);
    const radsqr = (ar + br) * (ar + br);

    return (distsqr <= radsqr);
}

