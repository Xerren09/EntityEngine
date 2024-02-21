import { HexColor } from "../Types/Types.js";
import Sprite from "./Sprite.js";
import SpriteSheet from "./SpriteSheet.js";

export default class AnimatedSprite extends Sprite {
    /**
     * The interval in milliseconds this animated sprite should update at.
     */
    public readonly speed: number;
    private _index: number = 0;
    /**
     * The index of the current frame.
     */
    public get index() {
        return this._index;
    }
    /**
     * The value of the current frame.
     */
    public get value() {
        return this.content[this._index];
    }
    private _lastUpdate: number = 0;

    constructor(speed: number, frames: Array<HexColor | number>, spriteSheet?: SpriteSheet) {
        super(frames, spriteSheet);
        this.speed = speed;
    }

    private Next() {
        const timeElapsedSinceUpdate = performance.now() - this._lastUpdate;
        if (timeElapsedSinceUpdate >= this.speed) {
            const currentIndex = this._index;
            this._index = (currentIndex + 1) % this.content.length;
            this._lastUpdate = performance.now();
        }
    }
}

export const DEBUG_ANIMATED_SPRITE = new AnimatedSprite(250, ["#ff0000", "#00ff00", "#0000ff"]);