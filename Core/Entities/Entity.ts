import { AnimatedSprite } from '../Sprites/AnimatedSprite.js';
import { Sprite } from '../Sprites/Sprite.js';
import { rectSize, vector2D } from '../Types/Types.js';
import { GetCollisionsByTag } from './Collision.js';

export class Entity {
    public readonly ID: string;
    public readonly Name: string;
    public Tags: string[];
    public Position: vector2D = { x: 0, y: 0 };
    // TODO: scale sprite to this size
    public Size: rectSize = { width: 0, height: 0 };
    public get Vertices(): vector2D[] {
        return [
            {
                x: this.Position.x - (this.Size.width / 2),
                y: this.Position.y - (this.Size.height / 2)
            },
            {
                x: this.Position.x + (this.Size.width / 2),
                y: this.Position.y - (this.Size.height / 2)
            },
            {
                x: this.Position.x + (this.Size.width / 2),
                y: this.Position.y + (this.Size.height / 2)
            },
            {
                x: this.Position.x - (this.Size.width / 2),
                y: this.Position.y + (this.Size.height / 2)
            }
        ];
    };
    //public Rotation: number = 0;
    public Sprite: Sprite | AnimatedSprite;

    constructor(name: string) {
        this.Name = name;
    }

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

    public MoveTowards(targetCoordinates: vector2D, step: number) {
        const distanceVector: vector2D = {
            x: targetCoordinates.x - (this.Position.x),
            y: targetCoordinates.y - (this.Position.y)
        };
        const vectorLength = Math.sqrt(Math.pow(distanceVector.x, 2) + Math.pow(distanceVector.y, 2));
        const normalVector: vector2D = {
            x: (distanceVector.x / vectorLength),
            y: (distanceVector.y / vectorLength),
        };
        this.Translate({ x: (normalVector.x * step), y: (normalVector.y * step) });
    }

    public GetCollisionsByTag(tags: Array<string>): Entity[] {
        return GetCollisionsByTag(this, tags);
    }
}