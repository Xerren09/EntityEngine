import { HexColor, rectSize } from "../Types/Types.js";
import SpriteSheet from "./SpriteSheet.js";
import { TextureResource } from "./TextureResource.js";

export default class AnimatedSprite extends TextureResource {
    /**
     * The interval in milliseconds this animated sprite will update at.
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
     * The number of frames in this animated sprite.
     */
    public get length() {
        return this._frames.length;
    }
    /**
     * The current frame of the animated sprite. Same as the value.
     */
    public get currentFrame() {
        return this._frames[this._index];
    }
    private _lastUpdate: number = 0;
    private _frames: Array<CanvasPattern> = [];

    /**
     * 
     * @param speed The interval in milliseconds this animated sprite should update at.
     * @param frames
     * @param tileSize The size of the segments should be rendered at.
     * @param spriteSheet The source spritesheet. This is only required if the content array contains numbers, which behave as a spritesheet tile index.
     */
    constructor(speed: number, frames: Array<HexColor | number>, tileSize: rectSize, spriteSheet?: SpriteSheet) {
        super(frames, tileSize, spriteSheet);
        this.speed = speed;
        this._frames = frames.map(frame => this.compile([frame], tileSize));
        this._value = this._frames[0];
    }

    /**
     * Advances the animation to the next frame, if enough time has elapsed.
     */
    private nextFrame() {
        const timeElapsedSinceUpdate = performance.now() - this._lastUpdate;
        if (timeElapsedSinceUpdate >= this.speed) {
            const currentIndex = this._index;
            this._index = (currentIndex + 1) % this._frames.length;
            this._value = this._frames[this._index];
            this._lastUpdate = performance.now();
        }
    }
}

export const DEBUG_ANIMATED_SPRITE = new AnimatedSprite(250, ["#ff0000", "#00ff00", "#0000ff"], { width: 5, height: 5});