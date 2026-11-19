import { Collider } from "./Collider.js";
import type { vector2D } from "../../../Types/Types.js";
import type Entity from "../../Entity.js";
import { Vector2D } from "../../../Math/Vector2D.js";

export type RectangleShape = ReadonlyArray<vector2D>;

/**
 * A simple rectangular collider. See {@link Collider} for more.
 */
export class RectCollider extends Collider {

    /**
     * The rect's dimensions.
     */
    public get size(): vector2D {
        return {
            y: this.rectSize.y,
            x: this.rectSize.x,
        };
    }
    public set size(value) {
        this.setRectSize(value);
    }

    constructor(size?: vector2D, offset?: vector2D) {
        super(size, offset);
    }

    /**
     * Sets the collider size.
     * @param rect 
     */
    public setSize(rect: vector2D) {
        this.setRectSize(rect);
    }

    protected resolve(a: Entity): vector2D[] {
        const point: vector2D = a["_position"];
        const vertexOffset: vector2D = { x: this.rectSize.x / 2, y: this.rectSize.y / 2 };
        const vertices = [
            {
                x: point.x - vertexOffset.x,
                y: point.y - vertexOffset.y
            },
            {
                x: point.x + vertexOffset.x,
                y: point.y - vertexOffset.y
            },
            {
                x: point.x + vertexOffset.x,
                y: point.y + vertexOffset.y
            },
            {
                x: point.x - vertexOffset.x,
                y: point.y + vertexOffset.y
            }
        ];
        return rotatePolygon(vertices, point, a.Rotation);
    }
}

function rotatePolygon(vertices: vector2D[], point: vector2D, angle: number): vector2D[] {
    const ret: vector2D[] = [];
    for (const vertex of vertices) {
        ret.push(Vector2D.rotate(vertex, point, angle));
    }
    return ret;
}