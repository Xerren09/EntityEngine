import { Entities } from "../Entities/Entities.js";
import AnimatedSprite from "../Sprites/AnimatedSprite.js";

export default function AnimationUpdateLoop() {
    const entities = Entities.List;
    for (const entity of entities) {
        const sprite = entity.Sprite;
        // If the sprite is animated, run the next update
        if ("Speed" in sprite) {
            (<AnimatedSprite>sprite).Next();
        }
    }
}