import { EntityManager } from "../Entities/Entities.js";
import AnimatedSprite from "../Sprites/AnimatedSprite.js";

export default function AnimationUpdateLoop(entities: EntityManager) {
    for (const entity of entities.List) {
        const sprite = entity.Sprite;
        // If the sprite is animated, run the next update
        if (sprite instanceof AnimatedSprite) {
            sprite["Next"]();
        }
    }
}