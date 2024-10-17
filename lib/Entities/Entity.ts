import AnimatedSprite from '../Sprites/AnimatedSprite.js';
import Sprite from '../Sprites/Sprite.js';
import { rectSize, vector2D } from '../Types/Types.js';
import { Collider } from './Collision/Colliders/Collider.js';
import { CollisionResolver } from './Collision/Resolver.js';
import { EntityManager } from './Entities.js';

/**
 * The basic building blocks of the game, entities serve as game objects that can render textures, move around, and interact with other entities.
 */
export default class Entity {
    /**
     * The entity's unique ID. Note that this only has to be unique within a given Engine instance. 
     * ID collisions will be checked when adding the entity to an instance.
     */
    public readonly ID: string;
    /**
     * Tags used for organisation purposes. See {@link EntityManager.FindAllTagged}
     */
    public Tags: string[] = [];
    public _position: vector2D = { x: 0, y: 0 };
    /**
     * The entity's position. This is treated as the center of the entity.
     */
    public get Position(): vector2D {
        return {
            x: this._position.x,
            y: this._position.y
        }
    }
    public set Position(val: vector2D) {
        this._position = {
            x: val.x,
            y: val.y
        };
    }

    /**
     * The entity's attached {@link Collider}.
     * Colliders allow the engine to detect when two entities interact.
     */
    public Collider?: Collider;

    private _size: rectSize = { width: 0, height: 0 };
    /**
     * The entity's rect size. This is used when rendering the given {@link Entity.Sprite}
     */
    public get Size() {
        return this._size;
    }
    public set Size(val: rectSize) {
        this._size = val;
    }

    private _rotation: number = 0;
    /**
     * Rotation in degrees.
     */
    public get Rotation() {
        return this._rotation;
    }
    public set Rotation(val: number) {
        this._rotation = val % 360;
    }
    
    /**
     * The entity's attached texture, either a {@link Sprite} or {@link AnimatedSprite}.
     * Sprites render into the defined {@link Size} rect, while respecting rotation.
     * 
     * See {@link Sprite} for more information about sprite rendering behaviour.
     */
    public Sprite?: Sprite | AnimatedSprite;

    /**
     * 
     * @param id The entity's unique ID. Note that this only has to be unique within a given Engine instance. ID collisions will be checked when adding the entity to an instance.
     */
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

    /**
     * Determines if this entity's collider is interesting with the target's, if both have colliders.
     * @param target 
     * @returns `true` is the two entity's colliders intersect, `false` if they don't. Also returns `false` if either or neither have no colliders attached.
     */
    public IsIntersecting(target: Entity): boolean {
        return CollisionResolver(this, target);
    }
}
