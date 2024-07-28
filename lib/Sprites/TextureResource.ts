import { HexColor, rectSize, vector2D } from "../Types/Types.js";
import SpriteSheet from "./SpriteSheet.js";

const compilationCanvas = new OffscreenCanvas(100, 100);

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

    protected _value: CanvasPattern;
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
    public get tileSize() : rectSize {
        return this._tileSize;
    }

    protected _source?: SpriteSheet;
    protected _tileSize: rectSize = { width: 5, height: 5 };
    protected _content: Array<HexColor | number> = [];

    constructor(content: Array<HexColor | number>, tileSize: rectSize, spriteSheet?: SpriteSheet) {
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
    protected compile(content: Array<HexColor | number>, tileSize: rectSize): CanvasPattern {
        compilationCanvas.width = content.length * tileSize.width;
        compilationCanvas.height = tileSize.height;
        const cCtx = compilationCanvas.getContext("2d");
        cCtx.clearRect(0, 0, compilationCanvas.width, compilationCanvas.height);
        for (let index = 0; index < content.length; index++) {
            const renderPos: vector2D = {
                x: index * tileSize.width,
                y: 0
            };
            const item = content[index];
            if (typeof item === "string") {
                cCtx.save();
                cCtx.fillStyle = item;
                cCtx.fillRect(renderPos.x, renderPos.y, tileSize.width, tileSize.height);
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
                    this._source.tileSize.width,
                    this._source.tileSize.height,
                    renderPos.x,
                    renderPos.y,
                    tileSize.width,
                    tileSize.height
                );
            }
        }
        return cCtx.createPattern(compilationCanvas as any as HTMLCanvasElement, "repeat");
    }
}