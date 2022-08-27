import Sprite from "./Sprite.js";

export default class AnimatedSprite extends Sprite {
    public readonly Speed: number;
    private _index: number = 0;
    public get Index() {
        return this._index;
    }
    public get Value() {
        return this.Contents[this._index];
    }
    private _lastUpdate: number = 0;

    constructor(name: string, speed: number, contents: Array<string | number>, spriteSheetID: string = "") {
        super(name, contents, spriteSheetID);
        this.Speed = speed;
    }

    public Next() {
        const timeElapsedSinceUpdate = performance.now() - this._lastUpdate;
        if (timeElapsedSinceUpdate >= this.Speed) {
            const currentIndex = this._index;
            this._index = (currentIndex + 1) % this.Contents.length;
            this._lastUpdate = performance.now();
        }
    }
}