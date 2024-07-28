import { HexColor, rectSize } from "../Types/Types";
import SpriteSheet from "./SpriteSheet";
import { TextureResource } from "./TextureResource";

export default class Sprite extends TextureResource {
    /**
     * 
     * @param content The list of segments in this sprite. Segments are rendered left-to-right.
     * @param tileSize The size of the segments should be rendered at.
     * @param spriteSheet The source spritesheet. This is only required if the content array contains numbers, which behave as a spritesheet tile index.
     */
    constructor(content: Array<HexColor | number>, tileSize: rectSize, spriteSheet?: SpriteSheet) {
        super(content, tileSize, spriteSheet);
        this._value = this.compile(content, tileSize);
    }    
}

/**
 * The classic eye-catching magenta color used as a placeholder.
 */
export const DEBUG_COLOR = "#FF00FF";

/**
 * A full magenta coloured sprite that can be used a placeholder.
 */
export const DEBUG_SPRITE = new Sprite([DEBUG_COLOR], { width: 5, height: 5});