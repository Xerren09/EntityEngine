import { rectSize } from "../Types/Types";
import { SpriteSheets } from "./Sprites.js";

export class AnimatedSprite {
    public readonly Name: string;
    public readonly Contents: Array<string | number>;
    public readonly SpriteSheetID: string;
    public readonly TileSize: rectSize = { width: -1, height: -1 };
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
        this.Name = name;
        this.Speed = speed;
        this.Contents = contents;
        this.SpriteSheetID = spriteSheetID;
        if (this.SpriteSheetID.length != 0) {
            this.TileSize = SpriteSheets.Find(spriteSheetID).TileSize;
        }
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