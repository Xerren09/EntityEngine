import { EntityList } from "./Entities.js";
import { vector2D } from "../Types/Types";
import { Entity } from "./Entity.js";

/**
 * Gets the list of Entities with the given tag(s) that are overlapping the specified Entity.
 * @param self The main Entity we are testing against.
 * @param tags The tags that are used for filtering. Only one must apply to an Entity in order to be tested.
 */
export function GetCollisionsByTag(self: Entity, tags: string[]): Array<Entity> {
    let collisionObjects = [];
    for (const target of EntityList) {
        const isMatching = tags.some(tag => target.Tags.includes(tag));
        if (isMatching) {
            // We need to check both self -> target, and target -> self
            // because in some cases (target is bigger than self) it's possible for vertices not be inside self or target
            if (isOverlapping(self, target) || isOverlapping(target, self))
            {
                collisionObjects.push(target);
            }
        }
    }
    return collisionObjects;
}

/**
 * Checks if two Entities are overlapping eachother.
 * @param entityA
 * @param entityB
 */
export function GetCollision(entityA: Entity, entityB: Entity): boolean {
    if (isOverlapping(entityA, entityB) || isOverlapping(entityB, entityA))
    {
        return true;
    }
    return false;
}

/**
 * Gets the list of every Entity that is colliding with the target. Note that this tests against every registered Entity, which can be extremely slow.
 * @param target
 */
export function GetCollisions(target: Entity): Array<Entity> {
    let collisionObjects = [];
    for (const target of EntityList) {
        if (isOverlapping(target, target) || isOverlapping(target, target))
        {
            collisionObjects.push(target);
        }
    }
    return collisionObjects;
}


function isOverlapping(self: Entity, target: Entity): boolean {
    let overlap = false;
    for (let testVertexIndex = 0; testVertexIndex < target.Vertices.length; testVertexIndex++) {
        // Assume we have a collision
        let isTestVertexInsideSelf = true;
        let isTestEdgeIntersect = false;
        // Get the vertex, whose orientation we want to check relative to the line 
        const target_pointA_index = testVertexIndex;
        const target_pointA = target.Vertices[target_pointA_index];
        const target_pointB_index = (testVertexIndex + 1 < self.Vertices.length) ? (testVertexIndex + 1) : (0);
        const target_pointB = target.Vertices[target_pointB_index];
        // Check vertex against self's every edge
        for (let selfVertexIndex = 0; selfVertexIndex < self.Vertices.length; selfVertexIndex++) {
            const self_pointA_index = selfVertexIndex;
            // Wrap-around for the final edge
            const self_pointB_index = (selfVertexIndex + 1 < self.Vertices.length) ? (selfVertexIndex + 1) : (0);
            const self_pointA = self.Vertices[self_pointA_index];
            const self_pointB = self.Vertices[self_pointB_index];
            // Check if testVertex is to the right of self's edge (counter-clockwise)
            const doEdgesIntersect = ((isLeft(self_pointA, self_pointB, target_pointB).edge != isLeft(self_pointA, self_pointB, target_pointA).edge) && (isLeft(target_pointA, target_pointB, self_pointA).edge != isLeft(target_pointA, target_pointB, self_pointB).edge));
            const isPointWithinSelf = isLeft(self_pointA, self_pointB, target_pointA).point;
            if (doEdgesIntersect) {
                // If true, we can ignore the rest of the edges, since one intersecting edge means collision
                isTestEdgeIntersect = true;
                break;
            }
            else if (isPointWithinSelf == false) {
                // If false, we can ignore the rest of the edges, since this MUST be true to ALL edges
                isTestVertexInsideSelf = false;
                break;
            }
        }
        if (isTestEdgeIntersect == true || isTestVertexInsideSelf == true) {
            // testVertex is inside self
            overlap = true;
            break;
        }
    }
    return overlap;
}

function isLeft(pointA: vector2D, pointB: vector2D, pointF: vector2D) {
    const BAx = pointB.x - pointA.x;
    const FAy = pointF.y - pointA.y;
    const BAy = pointB.y - pointA.y;
    const FAx = pointF.x - pointA.x;
    //
    const first = BAx * FAy;
    const second = BAy * FAx;
    //
    return {
        edge: (first > second),
        point: (first - second > 0),
    };
}