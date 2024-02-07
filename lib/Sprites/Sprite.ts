import { rectSize } from "../Types/Types";
import { SpriteSheets } from "./SpriteSheets.js";

export default class Sprite {
    public readonly ID: string;
    public readonly Contents: Array<string | number>;
    public readonly SpriteSheetID: string = "";
    public readonly TileSize: rectSize = { width: 5, height: 5 };

    // TODO: change spriteSheetID to SpriteSheet object
    constructor(id: string, contents: Array<string | number>, spriteSheet?: string | rectSize) {
        this.ID = id;
        this.Contents = contents;
        if (typeof spriteSheet === "string" && spriteSheet.length != 0) {
            this.SpriteSheetID = spriteSheet;
            this.TileSize = SpriteSheets.Find(spriteSheet).TileSize;
        }
        else if (typeof spriteSheet === "object") {
            this.TileSize = spriteSheet;
        }
    }
}

export const DEBUG_COLOR = "#FF00FF";

export const DEBUG_SPRITE = new Sprite("DEBUG_SPRITE", [DEBUG_COLOR], { width: 5, height: 5 });