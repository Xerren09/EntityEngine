import { rectSize } from "../Types/Types";
import { SpriteSheets } from "./Sprites.js";

export class Sprite {
    public readonly Name: string;
    public readonly Contents: Array<string | number>;
    public readonly SpriteSheetID: string;
    public readonly TileSize: rectSize = { width: -1, height: -1 };

    constructor(name: string, contents: Array<string | number>, spriteSheetID: string = "") {
        this.Name = name;
        this.Contents = contents;
        this.SpriteSheetID = spriteSheetID;
        if (this.SpriteSheetID.length != 0) {
            this.TileSize = SpriteSheets.Find(spriteSheetID).TileSize;
        }
    }
}