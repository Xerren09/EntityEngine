import { vector2D } from "../Types/Types.js";

export class Vector2D {
    public static equals(v1: vector2D, v2: vector2D): boolean {
        return (v1.x === v2.x && v1.y === v2.y);
    }

    public static distance(start: vector2D, end: vector2D): number {
        // Do not use Math.hypot, it is extremely slow on chromium
        const x = (start.x - end.x);
        const y = (start.y - end.y);
        return Math.sqrt((x*x) + (y*y));
    }

    public static magnitude(vector: vector2D): number {
        return Math.sqrt((vector.x * vector.x) + (vector.y * vector.y));
    }

    public static normalise(vector: vector2D): vector2D {
        const magnitude = this.magnitude(vector);
        return {
            x: vector.x / magnitude,
            y: vector.y / magnitude
        };
    }

    public static vector(v1: vector2D, v2: vector2D): vector2D {
        const v3: vector2D = {
            x: v1.x - (v2.x),
            y: v1.y - (v2.y)
        };
        return v3;
    }

    public static add(v1: vector2D, v2: vector2D): vector2D {
        return {
            x: v1.x + v2.x,
            y: v1.y + v2.y
        }
    }

    public static dot(v1: vector2D, v2: vector2D): number {
        return ((v1.x * v2.x) + (v1.y * v2.y));
    }

    public static rotate(v1: vector2D, v2: vector2D, angle: number) {
        angle = angle * Math.PI / 180.0;
        const sin = Math.sin(angle);
        const cos = Math.cos(angle);
        return {
            x: cos * (v1.x-v2.x) - sin * (v1.y-v2.y) + v2.x,
            y: sin * (v1.x-v2.x) + cos * (v1.y-v2.y) + v2.y
        };
    }

    public static scale(v: vector2D, scalar: number): vector2D {
        return {
            x: v.x * scalar,
            y: v.y * scalar
        }
    }
}
