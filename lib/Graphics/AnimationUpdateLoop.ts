import { EntityList } from "../Entities/Entities.js";
import AnimatedSprite from "../Sprites/AnimatedSprite.js";

export default function AnimationUpdateLoop() {
    EntityList.forEach(entity => {
        const sprite = entity.Sprite;
        // If the sprite is animated, run the next update
        if ("Speed" in sprite) {
            (<AnimatedSprite>sprite).Next();
        }
    });
}