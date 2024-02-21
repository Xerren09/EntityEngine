import { Collider } from "./index.js";
import { rect2D, rectSize, vector2D } from "../../../Types/Types.js";
import Entity from "../../Entity.js";
import { __overlap } from "../Collision.js";
import { Vector2D } from "../../Math/Vector2D.js";

export type RectangleShape = ReadonlyArray<vector2D>;

export class RectCollider extends Collider {

    constructor(size?: rectSize, offset?: vector2D) {
        super(size, offset);
    }

    public isIntersecting(target: Entity): boolean {
        if (target.Collider === undefined)
            return false;
        
        if (this.canSkipIntersectionCheck(target.Collider))
            return false;
        
        const self = this.resolve();
        
        if (target.Collider instanceof RectCollider) {
            const collider = target.Collider as RectCollider;
            const targetRect = collider.resolve();
            let overlap = __overlap(self, targetRect);
            return overlap ? overlap : __overlap(targetRect, self);
        }
        return false;
    }

    public resolve(): rect2D {
        const point: vector2D = this.position;
        const vertexOffset: rectSize = { width: this.rectSize.width / 2, height: this.rectSize.height / 2 };
        const vertices = [
            {
                x: point.x - vertexOffset.width,
                y: point.y - vertexOffset.height
            },
            {
                x: point.x + vertexOffset.width,
                y: point.y - vertexOffset.height
            },
            {
                x: point.x + vertexOffset.width,
                y: point.y + vertexOffset.height
            },
            {
                x: point.x - vertexOffset.width,
                y: point.y + vertexOffset.height
            }
        ];
        return {
            position: point,
            vertices: rotatePolygon(vertices, point, this._parent.Rotation)
        };
    }
}

// TODO: move to Renderer
/**
 * Calculates coordinates of a rectange's vertices around a given center point.
 * @param size 
 * @param point 
 * @returns 
 */
export function CalculateRectangleAroundPoint(size: rectSize, point: vector2D): RectangleShape {
    return [
        {
            x: point.x - (size.width / 2),
            y: point.y - (size.height / 2)
        } as const,
        {
            x: point.x + (size.width / 2),
            y: point.y - (size.height / 2)
        } as const,
        {
            x: point.x + (size.width / 2),
            y: point.y + (size.height / 2)
        } as const,
        {
            x: point.x - (size.width / 2),
            y: point.y + (size.height / 2)
        } as const
    ];
}

export function rotatePolygon(vertices: vector2D[], point: vector2D, angle: number): vector2D[] {
    const ret: vector2D[] = [];
    for (const vertex of vertices) {
        ret.push(Vector2D.rotate(vertex, point, angle));
    }
    return ret;
}