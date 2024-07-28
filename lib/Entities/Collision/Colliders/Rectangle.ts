import { Collider } from "./Collider.js";
import { rect2D, rectSize, vector2D } from "../../../Types/Types.js";
import Entity from "../../Entity.js";
import { polyIntersect } from "../Collision.js";
import { Vector2D } from "../../Math/Vector2D.js";

export type RectangleShape = ReadonlyArray<vector2D>;

export class RectCollider extends Collider {

    public get Size(): rectSize {
        return {
            height: this.rectSize.height,
            width: this.rectSize.width,
        };
    }

    constructor(size?: rectSize, offset?: vector2D) {
        super(size, offset);
    }

    /**
     * Sets the collider size.
     * @param rect 
     */
    public setSize(rect: rectSize) {
        this.setRectSize(rect);
    }

    protected resolve(a: Entity): rect2D {
        const point: vector2D = a.Position;
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
            vertices: rotatePolygon(vertices, point, a.Rotation)
        };
    }
}

export function rotatePolygon(vertices: vector2D[], point: vector2D, angle: number): vector2D[] {
    const ret: vector2D[] = [];
    for (const vertex of vertices) {
        ret.push(Vector2D.rotate(vertex, point, angle));
    }
    return ret;
}