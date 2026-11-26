import { degToRad, RAD, radToDeg, Vector2D } from '../Math/Vector2D.js';
import type AnimatedSprite from '../Sprites/AnimatedSprite.js';
import type Sprite from '../Sprites/Sprite.js';
import type { IEntityAttribute, vector2D } from '../Types/Types.js';
import type { Collider } from './Collision/Colliders/Collider.js';
import { CollisionResolver } from './Collision/Resolver.js';
import { type EntityManager } from './Entities.js';


/**
 * The basic building blocks of the game, entities serve as game objects that can render textures, move around, and interact with other entities.
 */
export default class Entity {
    protected _position: vector2D = { x: 0, y: 0 };
    private _rotation: number = 0;
    private _rotationDeg: number = 0;
    protected _renderSize: vector2D = { x: 0, y: 0 };

    /**
     * The entity's unique ID. Note that this only has to be unique within a given Engine instance. 
     * ID collisions will be checked when adding the entity to an instance.
     */
    public readonly ID: string;
    /**
     * Tags used for organisation purposes. See {@link EntityManager.FindAllTagged}.
     */
    public Tags: Set<string> = new Set<string>();
    /**
     * List of attributes assigned to this entity. Attributes can describe some abstract property of the object, for example colliders.
     * 
     * See {@link IEntityAttribute} for more.
     */
    public attributes: IEntityAttribute[] = [];
    /**
     * The entity's position. This is the center of the entity's rendering rect. See {@link Entity.RenderSize}.
     */
    public get Position(): vector2D {
        return {...this._position};
    }
    public set Position(val: vector2D) {
        this._position.x = val.x;
        this._position.y = val.y;
        this.updateAttributes();
    }

    /**
     * Rotation in radians.
     */
    public get Rotation() {
        return this._rotation;
    }
    public set Rotation(val: number) {
        this._rotation = val;
        this._rotationDeg = radToDeg(val);
        this.updateAttributes();
    }
    /**
     * Rotation in degrees.
     */
    public get RotationDeg() {
        return this._rotationDeg;
    }
    public set RotationDeg(val: number) {
        this.Rotation = degToRad(val % 360);
    }

    /**
     * The entity's rendering rect size. This is the size of the rect that will be filled with {@link Entity.Sprite}.
     */
    public get RenderSize(): vector2D {
        return {...this._renderSize};
    }
    public set RenderSize(val: vector2D) {
        this._renderSize.x = val.x;
        this._renderSize.y = val.y;
    }
    
    /**
     * The entity's attached texture, either a {@link Sprite} or {@link AnimatedSprite}.
     * Sprites render into the defined {@link RenderSize} rect, while respecting rotation.
     * 
     * See {@link Sprite} for more information about sprite rendering behaviour.
     */
    public Sprite?: Sprite | AnimatedSprite;

    /**
     * The entity's attached {@link Collider}.
     * Colliders allow the engine to detect when two entities interact.
     */
    public Collider?: Collider;

    /**
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
        this._position.x += vector.x;
        this._position.y += vector.y;
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
        if (Vector2D.equalf(this._position, targetCoordinates)) {
            return;
        }
        let dx = targetCoordinates.x - (this._position.x);
        let dy = targetCoordinates.y - (this._position.y);
        // Get distance between this and target
        const length = Math.sqrt((dx * dx) + (dy * dy));
        // Normalise
        dx = dx / length;
        dy = dy / length;
        // distance check to stop wiggle
        if (length >= step) {
            this._position.x += dx * step;
            this._position.y += dy * step;
        }
        else {
            this._position.x = targetCoordinates.x;
            this._position.y = targetCoordinates.y;
        }
        this.updateAttributes();
    }

    /**
     * Determines if this entity's collider is interesting with the target's, if both have colliders.
     * @param target 
     * @returns `true` is the two entity's colliders intersect, `false` if they don't. Also returns `false` if either or neither have no colliders attached.
     */
    public IsIntersecting(target: Entity): boolean {
        return CollisionResolver(this, target);
    }

    /**
     * See {@link IEntityAttribute} for updated properties.
     */
    protected updateAttributes() {
        for (let index = 0; index < this.attributes.length; index++) {
            const attribute = this.attributes[index];
            attribute.onTransformChange();
        }
    }
}
