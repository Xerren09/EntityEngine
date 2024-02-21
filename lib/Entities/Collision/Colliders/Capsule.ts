import { Collider } from "./index.js";
import { circle2D, vector2D } from "../../../Types/Types.js";
import Entity from "../../Entity.js";

export type CapsuleShape = ReadonlyArray<(vector2D | circle2D)>;

/**
 * Calculates coordinates of a rectange's vertices around a given center point.
 * @param size 
 * @param point 
 * @returns 
 */
export function CalculateCapsuleAroundPoint(shape: CapsuleShape, shapeCenter: vector2D, newCenter: vector2D): CapsuleShape {
    let newShape: Array<(vector2D | circle2D)>;
    for (const segment of shape) {
        if ((segment as vector2D).x !== undefined) {
            const vector: vector2D = segment as vector2D;
            const offset: vector2D = {
                x: (shapeCenter.x - vector.x),
                y: (shapeCenter.y - vector.y)
            }
            newShape.push({
                x: newCenter.x - offset.x,
                y: newCenter.y - offset.y
            });
        }
        else if ((segment as circle2D).radius !== undefined) {
            const circle: circle2D = segment as circle2D;
            const offset: vector2D = {
                x: (shapeCenter.x - circle.position.x),
                y: (shapeCenter.y - circle.position.y)
            }
            newShape.push({
                position: {
                    x: newCenter.x - offset.x,
                    y: newCenter.y - offset.y
                },
                radius: circle.radius
            });
        }
    }
    return newShape;
}

export class CapsuleCollider extends Collider {
    public resolve() {
        throw new Error("Method not implemented.");
    }
    public isIntersecting(target: Entity): boolean {
        throw new Error("Method not implemented.");
    }
    constructor(parent: Entity) {
        super();
    }
}