import AnimatedSprite from '../Sprites/AnimatedSprite.js';
import Sprite from '../Sprites/Sprite.js';
import { rectSize, vector2D } from '../Types/Types.js';
import { Collider } from './Collision/Colliders/index.js';
import { GetCollisionsByTag } from './Collision/Collision.js';

export default class Entity {
    public readonly ID: string;
    public Tags: string[] = [];
    public Position: vector2D = { x: 0, y: 0 };

    private _collider?: Collider;
    public get Collider(): undefined | Collider {
        return this._collider;
    }
    public set Collider(value: Collider) {
        // Detach from previous parent
        if (value["_parent"]) {
            value["_parent"].Collider = undefined;
        }
        value["_parent"] = this;
        this._collider = value;
    }
    // TODO: scale sprite to this size
    private _size: rectSize = { width: 0, height: 0 };

    public get Size() {
        return this._size;
    }
    public set Size(val: rectSize) {
        this._size = val;
    }

    public get Vertices(): ReadonlyArray<vector2D> {
        return [
            {
                x: this.Position.x - (this.Size.width / 2),
                y: this.Position.y - (this.Size.height / 2)
            } as const,
            {
                x: this.Position.x + (this.Size.width / 2),
                y: this.Position.y - (this.Size.height / 2)
            } as const,
            {
                x: this.Position.x + (this.Size.width / 2),
                y: this.Position.y + (this.Size.height / 2)
            } as const,
            {
                x: this.Position.x - (this.Size.width / 2),
                y: this.Position.y + (this.Size.height / 2)
            } as const
        ];
    };

    private _rotation: number = 0;
    public get Rotation() {
        return this._rotation;
    }
    public set Rotation(val: number) {
        this._rotation = val % 360;
    }
    
    public Sprite?: Sprite | AnimatedSprite;

    constructor(id: string) {
        this.ID = id;
    }

    /**
     * Moves the entity by the given vector.
     * @param vector 
     */
    public Translate(vector: vector2D) {
        if (isNaN(vector.x)) {
            vector.x = 0;
        }
        if (isNaN(vector.y)) {
            vector.y = 0;
        }
        this.Position.x += vector.x;
        this.Position.y += vector.y;
    }

    /**
     * Moves the entity towards a given point, by the specified amount per call.
     * 
     * To smoothly move the entity at a constant speed, multiply the step value with time.delta:
     * 
     * ```js
     * const step = 10;
     * entity.MoveTowards(targetPoint, step * time.delta);
     * ```
     * @param targetCoordinates 
     * @param step The number of pixels the entity should move per call.
     */
    public MoveTowards(targetCoordinates: vector2D, step: number) {
        const distanceVector: vector2D = {
            x: targetCoordinates.x - (this.Position.x),
            y: targetCoordinates.y - (this.Position.y)
        };
        // Get distance between this and target
        const vectorLength = Math.sqrt(Math.pow(distanceVector.x, 2) + Math.pow(distanceVector.y, 2));
        const normalVector: vector2D = {
            x: (distanceVector.x / vectorLength),
            y: (distanceVector.y / vectorLength),
        };
        // distance check to stop wiggle
        if (vectorLength >= step) {
            this.Translate({ x: (normalVector.x * step), y: (normalVector.y * step) });
        }
    }

    /*
    public GetCollisionsByTag(tags: Array<string>): Entity[] {
        //return GetCollisionsByTag(this, tags);
        const filtered = Entities.FindAllTagged("block");
        const ret: Entity[] = [];
        for (const entity of filtered) {
            if (entity.Collider) {
                if (entity.Collider.isOversecting(entity)) {
                    ret.push(entity);
                }
            }
        }
        return ret;
    }

    public Destroy() {
        Entities.Destroy(this.ID);
    }
    */
}
