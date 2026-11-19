import type { ReadonlyVector2D, vector2D } from "../Types/Types.js";

export default class SpriteSheet
{
    public readonly Image: HTMLImageElement = new Image();
    private _ready: boolean = false;
    /**
     * Indicates if the spritesheet image has been successfully loaded, decoded, and is ready to use.
     */
    public get ready(): boolean  {
        return this._ready;
    }
    private _source: string = "";
    get source(): string {
        return this._source;
    }
    private _height: number = 0;
    get height() {
        return this._height;
    }
    private _width: number = 0;
    get width() {
        return this._width;
    }
    private _tileSize: vector2D;
    get tileSize() {
        return this._tileSize;
    }
    private _indices: Array<vector2D> = [];
    public get indexMatrix(): ReadonlyArray<ReadonlyVector2D>
    { 
        return [...this._indices];
    }

    /**
     * Create a new SpriteSheet instance.
     * @param source
     * @param tileSize
     */
    constructor(source: string, tileSize: vector2D) {
        this._source = source;
        // Anything below zero turns the preprocesor into a memory bomb.
        if (tileSize.x <= 0) {
            tileSize.x = 1;
        }
        if (tileSize.y <= 0) {
            tileSize.y = 1;
        }
        this._tileSize = tileSize;
    }

    /**
     * Loads the Spritesheet image. Once the spritesheet has been successfully loaded (see {@link ready} property), subsequent calls will perform no action.
     */
    public async Load() {
        if (this._ready == false) {
            this.Image.src = this._source;
            try {
                await this.Image.decode();
            }
            catch (e) {
                console.error(`Error while loading spritesheet from ${this._source}.`);
                throw e;
            }
            this._height = this.Image.height;
            this._width = this.Image.width;
            this.IndexSpritesheet();
            this._ready = true;
        }  
    }

    /**
     * Gets the coordinates of the sprite at the given index.
     * @param index
     */
    public GetSpriteCoordinates(index: number): ReadonlyVector2D {
        if (index >= this._indices.length) {
            console.warn(`Index ${index} is outside the bounds of SpriteSheet (${this.source}). The default 0,0 index will be used for this segment instead.`);
            return { x: 0, y: 0 };
        }
        else {
            return this._indices[index];
        }
    }

    private IndexSpritesheet() {
        const row_count = Math.floor(this._height / this._tileSize.y);
        const column_count = Math.floor(this._width / this._tileSize.x);
        // Gets number of sprites
        const sprite_segments = row_count * column_count;
        // Uses 1 based indexing
        for (let index = 1; index < sprite_segments; index++) {
            // These two values are always 1 smaller than the actual row and column
            /**
             * row_number calculates the row of the given sprite using the following logic:
             * ( index of sprite / number of sprites in a row ) - 1
             * For example for index 15, with 7 width rows:
             * (15 / 7 ) = 2.14285 (ceil)=> 3.
             * 3-1 = 2
             */
            const row_Number = Math.ceil(index / column_count) - 1;
            const column_Number = (index - ((row_Number) * (column_count))) - 1;
            // Gets the top-left most coordinates of the sprite. Render to the right and down
            const index_row = (row_Number * this._tileSize.y);
            const index_column = (column_Number * this._tileSize.x);
            // Add the coordinate to the matrix
            /**
             * Cross reference for V1's SpriteSheetIndexer
             * rowIndex = y,
             * columnIndex = x
             */
            this._indices.push({ x: index_column, y: index_row });
        }
    }
};