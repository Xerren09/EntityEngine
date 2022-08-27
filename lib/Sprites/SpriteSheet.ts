import { rectSize, vector2D } from "../Types/Types";

export default class SpriteSheet
{
    public readonly ID: string = "";
    public readonly Image: HTMLImageElement = new Image();
    private _source: string = "";
    private _height: number = 0;
    get Height() {
        return this._height;
    }
    private _width: number = 0;
    get Width() {
        return this._width;
    }
    private _tileSize: rectSize;
    get TileSize() {
        return this._tileSize;
    }
    public readonly IndexMatrix: Array<vector2D> = [];

    /**
     * Create a new SpriteSheet instance.
     * @param source
     * @param tileSize
     */
    constructor(id: string, source: string, tileSize: rectSize) {
        this.ID = id;
        this._source = source;
        // Anything below zero turns the proprocesor into a memory bomb.
        if (tileSize.width <= 0) {
            tileSize.width = 1;
        }
        if (tileSize.height <= 0) {
            tileSize.height = 1;
        }
        this._tileSize = tileSize;
    }

    /**
     * Loads the Spritesheet image.
     *
     */
    public async Load() {
        // Await loading the image
        this.Image.decode().then(() => {
            this._height = this.Image.height;
            this._width = this.Image.width;
            this.Indexer();
        }).catch((encodingError) => {
            console.error("Error while loading spritesheet: " + encodingError);
            throw encodingError;
        });
        this.Image.src = this._source;
    }

    /**
     * Gets the coordinates of the sprite at the given index.
     * @param index
     */
    public GetSpriteCoordinates(index: number): vector2D {
        if (index >= this.IndexMatrix.length) {
            console.warn(`Index ${index} is outside the bounds of SpriteSheet ${this.ID}.`);
            return { x: -1, y: -1 };
        }
        else {
            return this.IndexMatrix[index];
        }
    }

    private Indexer() {
        const row_count = Math.floor(this._height / this._tileSize.height);
        const column_count = Math.floor(this._width / this._tileSize.width);
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
            const index_row = (row_Number * this._tileSize.height);
            const index_column = (column_Number * this._tileSize.width);
            // Add the coordinate to the matrix
            /**
             * Cross reference for V1's SpriteSheetIndexer
             * rowIndex = y,
             * columnIndex = x
             */
            this.IndexMatrix.push({ x: index_column, y: index_row });
        }
    }
};