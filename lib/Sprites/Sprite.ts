import { rectSize } from "../Types/Types";
import { SpriteSheets } from "./SpriteSheets.js";

export default class Sprite {
    public readonly ID: string;
    public readonly Contents: Array<string | number>;
    public readonly SpriteSheetID: string;
    public readonly TileSize: rectSize = { width: -1, height: -1 };

    constructor(id: string, contents: Array<string | number>, spriteSheetID: string = "") {
        this.ID = id;
        this.Contents = contents;
        this.SpriteSheetID = spriteSheetID;
        if (this.SpriteSheetID.length != 0) {
            this.TileSize = SpriteSheets.Find(spriteSheetID).TileSize;
        }
    }
}