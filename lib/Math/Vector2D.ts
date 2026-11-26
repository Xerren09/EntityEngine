import { vector2D } from "../Types/Types.js";

class vec2 {
    public x: number;
    public y: number;
    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }
}

const test: vector2D = new vec2(2, 3);

export const RAD: number = Math.PI / 180.0;
export const DEG: number = 180.0 / Math.PI;

export function degToRad(deg: number): number {
    return deg * RAD;
}

export function radToDeg(rad: number): number {
    return rad * DEG;
}

/**
 * Static class providing vector operatons.
 */
export class Vector2D {
    public static equals(v1: vector2D, v2: vector2D): boolean {
        return (v1.x === v2.x && v1.y === v2.y);
    }

    public static equalf(v1: vector2D, v2: vector2D, tolerance = Number.EPSILON): boolean {
        const x = Math.abs(v1.x - v2.x) <= (Number.MAX_VALUE, Number.EPSILON * Math.max(v1.x, v2.x));
        const y = Math.abs(v1.y - v2.y) <= (Number.EPSILON * Math.max(v1.y, v2.y));
        return x && y;
    }

    /**
     * Returns the distance between to vectors.
     * @param start 
     * @param end 
     * @returns 
     */
    public static distance(start: vector2D, end: vector2D): number {
        // Do not use Math.hypot, it is extremely slow on chromium
        const x = (start.x - end.x);
        const y = (start.y - end.y);
        return Math.sqrt((x*x) + (y*y));
    }

    public static distanceSquared(start: vector2D, end: vector2D): number {
        const x = (start.x - end.x);
        const y = (start.y - end.y);
        return (x * x) + (y * y);
    }

    /**
     * Retruns the length of the given vector.
     * @param vector 
     * @returns 
     */
    public static magnitude(vector: vector2D): number {
        return Math.sqrt((vector.x * vector.x) + (vector.y * vector.y));
    }

    public static lengthSquared(vector: vector2D): number {
        return (vector.x * vector.x) + (vector.y * vector.y);
    }

    /**
     * Returns the unit vector of the given vector.
     * @param vector 
     * @returns 
     */
    public static normalise(vector: vector2D): vector2D {
        const magnitude = this.magnitude(vector);
        return {
            x: vector.x / magnitude,
            y: vector.y / magnitude
        };
    }

    /**
     * Adds two vectors.
     * @param v1 
     * @param v2 
     * @returns 
     */
    public static add(v1: vector2D, v2: vector2D): vector2D {
        return {
            x: v1.x + v2.x,
            y: v1.y + v2.y
        }
    }

    public static subtract(v1: vector2D, v2: vector2D): vector2D {
        return {
            x: v1.x - v2.x,
            y: v1.y - v2.y
        }
    }

    /**
     * Returns the dot product of two vectors.
     * @param v1 
     * @param v2 
     * @returns 
     */
    public static dot(v1: vector2D, v2: vector2D): number {
        return ((v1.x * v2.x) + (v1.y * v2.y));
    }

    /**
     * Rotates the vector around the point by the given angle.
     * @param v The vector to rotate
     * @param p The origin of rotation
     * @param angle The angle of rotation in radians
     * @returns 
     */
    public static rotate(v: vector2D, p: vector2D, angle: number) {
        const sin = Math.sin(angle);
        const cos = Math.cos(angle);
        return {
            x: cos * (v.x-p.x) - sin * (v.y-p.y) + p.x,
            y: sin * (v.x-p.x) + cos * (v.y-p.y) + p.y
        };
    }

    /**
     * Scales a vector by the given scalar.
     * @param v 
     * @param scalar 
     * @returns 
     */
    public static scale(v: vector2D, scalar: number): vector2D {
        return {
            x: v.x * scalar,
            y: v.y * scalar
        }
    }

    /**
     * Clamps a vector's components between the given range
     * @param v 
     * @param min 
     * @param max 
     * @returns 
     */
    public static clamp(v: vector2D, min: vector2D, max: vector2D): vector2D {
        return { x: clamp(v.x, min.x, max.x), y: clamp(v.y, min.y, max.y) };
    }

    /**
     * Reverses a vector.
     * @param v 
     * @returns 
     */
    public static negate(v: vector2D): vector2D {
        return { x: -v.x, y: -v.y };
    }

    /**
     * Reverses a vector in place, modifying the passed object.
     * @param v 
     */
    public static negateInPlace(v: vector2D) {
        v.x = -v.x;
        v.y = -v.y;
    }

    public static fromValues(x: number, y: number): vector2D {
        return {
            x: x,
            y: y
        }
    }

    public static copy(v: vector2D): vector2D {
        return {
            x: v.x,
            y: v.y
        }
    }
}

function clamp(value: number, min: number, max: number) {
    return Math.max(min, Math.min(max, value));
}