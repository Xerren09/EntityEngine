import { vector2D } from "../../Types/Types.js";

export function Dot(v1: vector2D, v2: vector2D): number {
    return ((v1.x * v2.x) + (v1.y * v2.y))
}

export function Distance(start: vector2D, end: vector2D): number {
    return Math.hypot((start.x - end.x), (start.y - end.y));
}

export function Magnitude(vector: vector2D): number {
    return Math.hypot(vector.x, vector.y)
}

export function ToUnit(vector: vector2D): vector2D {
    const magnitude = Magnitude(vector);
    return {
        x: vector.x / magnitude,
        y: vector.y / magnitude
    };
}

export function Subtract(v1: vector2D, v2: vector2D): vector2D {
    const v3: vector2D = {
        x: v1.x - (v2.x),
        y: v1.y - (v2.y)
    };
    return v3;
}

export function Equals(v1: vector2D, v2: vector2D): boolean {
    return (v1.x === v2.x && v1.y === v2.y);
}

export class Vector2D {
    public static equals(v1: vector2D, v2: vector2D): boolean {
        return (v1.x === v2.x && v1.y === v2.y);
    }

    public static distance(start: vector2D, end: vector2D): number {
        const x = (start.x - end.x);
        const y = (start.y - end.y);
        return Math.sqrt((x*x) + (y*y));
    }

    public static magnitude(vector: vector2D): number {
        return Math.sqrt((vector.x * vector.x) + (vector.y * vector.y));
    }

    public static normalise(vector: vector2D): vector2D {
        const magnitude = Magnitude(vector);
        return {
            x: vector.x / magnitude,
            y: vector.y / magnitude
        };
    }

    public static subtract(v1: vector2D, v2: vector2D): vector2D {
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

export function pDistance(point: vector2D, a: vector2D, b: vector2D) {

    var A = point.x - a.x;
    var B = point.y - a.y;
    var C = b.x - a.x;
    var D = b.y - a.y;
  
    var dot = A * C + B * D;
    var len_sq = C * C + D * D;
    var param = -1;
    if (len_sq != 0) //in case of 0 length line
        param = dot / len_sq;
  
    var xx, yy;
  
    if (param < 0) {
        xx = a.x;
        yy = a.y;
    }
    else if (param > 1) {
        xx = b.x;
        yy = b.y;
    }
    else {
        xx = a.x + param * C;
        yy = point.y + param * D;
    }
  
    var dx = point.x - xx;
    var dy = point.y - yy;
    return Math.sqrt(dx * dx + dy * dy);
}

function distanceSqr(v: vector2D, w: vector2D) {
    const a = (v.x - w.x);
    const b = (v.y - w.y);
    return ((a*a) + (b*b))
}

function distToSegmentSquared(p: vector2D, v: vector2D, w: vector2D) {
    var l2 = distanceSqr(v, w);
    if (l2 == 0)
        return distanceSqr(p, v);
    var t = ((p.x - v.x) * (w.x - v.x) + (p.y - v.y) * (w.y - v.y)) / l2;
    t = Math.max(0, Math.min(1, t));
    return distanceSqr(p, {
        x: v.x + t * (w.x - v.x),
        y: v.y + t * (w.y - v.y)
    });
}
function distToSegment(p: vector2D, v: vector2D, w: vector2D) { return Math.sqrt(distToSegmentSquared(p, v, w)); }