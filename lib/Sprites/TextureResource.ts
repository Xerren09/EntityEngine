import { HexColor, vector2D } from "../Types/Types.js";
import SpriteSheet from "./SpriteSheet.js";

const compilationCanvas = new OffscreenCanvas(100, 100);

/**
 * The base of all sprite resources. Sprites can be re-used between entities, and are treated independently during the rendering pass.
 * 
 * When assigning the content array, they can be either string hex colour codes or tile indexes from a specific spritesheet.
 * These will be sticthed together into a single texture, and rendered left to right, in order.
 * 
 * If an entity's render size is smaller than the sprite's, the texture will be cut off during the rendering pass.
 * If an entity's render size is larger than the sprite's, the texture will repeat left-to-right, top-to-bottom to fill the render rect.
 */
export abstract class TextureResource {
    protected _opacity: number = 1;
    /**
     * The opacity of the texture. The value is between 0 and 1.
     */
    public set opacity(value: number) {
        this._opacity = (value <= 1 && value >= 0) ? value : 1; 
    }
    public get opacity() {
        return this._opacity;
    }

    protected _value!: CanvasPattern;
    /**
     * The compiled value of the texture.
     */
    public get value(): CanvasPattern {
        return this._value;
    }

    /**
     * The list of segments making up the texture.
     */
    public get segments() : ReadonlyArray<HexColor | number> {
        return [...this._content];
    }

    // FIXME: explain tilesize
    /**
     * 
     */
    public get tileSize() : vector2D {
        return this._tileSize;
    }

    protected _source?: SpriteSheet;
    protected _tileSize: vector2D = { x: 5, y: 5 };
    protected _content: Array<HexColor | number> = [];

    constructor(content: Array<HexColor | number>, tileSize: vector2D, spriteSheet?: SpriteSheet) {
        this._tileSize = tileSize;
        this._content = content;
        this._source = spriteSheet;
    }

    /**
     * Compiles the described texture into a CanvasPattern object used at rendering time.
     * @param content 
     * @param tileSize 
     * @returns 
     */
    protected compile(content: Array<HexColor | number>, tileSize: vector2D): CanvasPattern {
        compilationCanvas.width = content.length * tileSize.x;
        compilationCanvas.height = tileSize.y;
        const cCtx = compilationCanvas.getContext("2d")!;
        cCtx.clearRect(0, 0, compilationCanvas.width, compilationCanvas.height);
        for (let index = 0; index < content.length; index++) {
            const renderPos: vector2D = {
                x: index * tileSize.x,
                y: 0
            };
            const item = content[index];
            if (typeof item === "string") {
                cCtx.save();
                cCtx.fillStyle = item;
                cCtx.fillRect(renderPos.x, renderPos.y, tileSize.x, tileSize.y);
                cCtx.restore();
            }
            else if (typeof item === "number") {
                if (this._source === undefined) {
                    throw new Error("Missing SpriteSheet declaration while tile index is specified; assign a spritesheet in the Sprite's constructor if you want to use indexes.");
                }
                const segment = this._source.GetSpriteCoordinates(item);
                cCtx.drawImage(
                    this._source.Image,
                    segment.x,
                    segment.y,
                    this._source.tileSize.x,
                    this._source.tileSize.y,
                    renderPos.x,
                    renderPos.y,
                    tileSize.x,
                    tileSize.y
                );
            }
        }
        return cCtx.createPattern(compilationCanvas as any as HTMLCanvasElement, "repeat")!;
    }
}