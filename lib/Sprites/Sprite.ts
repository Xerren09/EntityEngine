import { HexColor, rectSize } from "../Types/Types.js";
import SpriteSheet from "./SpriteSheet.js";
import { TextureResource } from "./TextureResource.js";

/**
 * A simple static sprite. Sprites can be re-used between entities, and are treated independently during the rendering pass.
 * 
 * When assigning the content array, they can be either string hex colour codes or tile indexes from a specific spritesheet.
 * These will be sticthed together into a single texture, and rendered left to right, in order.
 * 
 * If an entity's render size is smaller than the sprite's, the texture will be cut off during the rendering pass.
 * If an entity's render size is larger than the sprite's, the texture will repeat left-to-right, top-to-bottom to fill the render rect.
 */
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