import { HexColor, rectSize, vector2D } from "../Types/Types.js";
import SpriteSheet from "./SpriteSheet.js";

const compilationCanvas = new OffscreenCanvas(100, 100);

export default class Sprite {
    /**
     * The list of segments in this sprite. 
     * 
     * Segments are rendered left-to-right, and repeated from start to finish to fill the width of the entity.
     */
    public readonly content: ReadonlyArray<HexColor | number>;
    /**
     * The source SpriteSheet if any.
     */
    public readonly source?: SpriteSheet = undefined;
    /**
     * The size of each segment in the {@link content} array.
     */
    private tileSize: rectSize = { width: 5, height: 5 };
    protected _opacity: number = 1;
    public set opacity(value: number) {
        this._opacity = (value <= 1 && value >= 0) ? value : 1; 
    }
    public get opacity() {
        return this._opacity;
    }

    /**
     * 
     * @param content The contents of this sprite. 
     * @param spriteSheet The source spritesheet. This is only required if the content array contains numbers, which behave as a spritesheet tile index.
     */
    constructor(content: Array<HexColor | number>, spriteSheet?: SpriteSheet) {
        this.content = content;
        if (spriteSheet) {
            this.source = spriteSheet;
            this.tileSize = spriteSheet.tileSize;
        }
        this.compile();
    }

    protected compile() {
        compilationCanvas.width = this.content.length * this.tileSize.width;
        compilationCanvas.height = this.tileSize.height;
        const cCtx = compilationCanvas.getContext("2d");
        cCtx.clearRect(0, 0, compilationCanvas.width, compilationCanvas.height);
        for (let index = 0; index < this.content.length; index++) {
            const renderPos: vector2D = {
                x: index * this.tileSize.width,
                y: 0
            };
            const item = this.content[index];
            if (typeof item === "string") {
                cCtx.save();
                cCtx.fillStyle = item;
                cCtx.fillRect(renderPos.x, renderPos.y, this.tileSize.width, this.tileSize.height);
                cCtx.restore();
            }
            else if (typeof item === "number") {
                const segment = this.source.GetSpriteCoordinates(item);
                cCtx.drawImage(
                    this.source.Image,
                    segment.x,
                    segment.y,
                    this.tileSize.width,
                    this.tileSize.height,
                    renderPos.x,
                    renderPos.y,
                    this.tileSize.width,
                    this.tileSize.height
                );
            }
        }
        this._content = cCtx.createPattern(compilationCanvas as any as HTMLCanvasElement, "repeat");
    }

    public _content: CanvasPattern;
    
}

export interface SpriteProperties {
    readonly source?: SpriteSheet;
    set opacity(value: number);
    get opacity(): number;
}

/**
 * The classic eye-catching magenta color used as a placeholder.
 */
export const DEBUG_COLOR = "#FF00FF";

/**
 * A full magenta coloured sprite that can be used a placeholder.
 */
export const DEBUG_SPRITE = new Sprite([DEBUG_COLOR]);