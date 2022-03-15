export const spriteSheet = {
    image: undefined,
    source: "",
    height: 0,
    width: 0,
    tileSize: -1,
    indexMatrix: []
};

/**
 * 
 * @param {*} imgSource 
 * @param {*} tileSize `-1` by default as a security option, this will ensure it can't be `0`, or it essentially turns into a memory bomb because of a division by zero issue
 */
export function setSpriteSheet(imgSource="", tileSize=-1) {
    spriteSheet.source = imgSource;
    if (tileSize == 0)
    {
        tileSize = -1;
    }
    spriteSheet.tileSize = tileSize;
}

export const sprites = [];

export const sprite = {
    find(spriteName) {
        const spriteObj = sprites.find(element => element.name == spriteName);
        if (spriteObj == undefined)
        {
            console.error(new Error(`sprite.find : sprite "${spriteName}" does not exist. Declare the sprite first before accessing it.`));
            return undefined;
        }
        else
        {
            return {
                ...spriteObj,
                props: spriteObj
            };
        }
    },
    new: {
        animated(spriteName, animationSpeedMS, ...items) {
            if (sprites.findIndex(element => element.name === spriteName) == -1)
            {
                sprites.push({
                    name: spriteName,
                    speed: animationSpeedMS,
                    items: items,
                    animated: true
                });
            }
            else
            {
                throw new Error(`sprite.new.animated : sprite "${objectName}" already exists.`);
            }
        },
        normal(spriteName, ...items) {
            if (sprites.findIndex(element => element.name === spriteName) == -1)
            {
                sprites.push({
                    name: spriteName,
                    items: items,
                    animated: false
                });
            }
            else
            {
                throw new Error(`sprite.new.normal : sprite "${objectName}" already exists.`);
            }
        }
    }
};

/**
 * On engine startup this preprocessor caches sprite locations to avoid on-the-fly indexing (like the previous version did).
 * The index of the elements of index_matrix correspond to the 1 based idex of the sprite - 1.
 * In practice this means the coordinates for a sprite with index n are in index_matrix[n-1].
 */
export const preprocessor = {
    run() {
        this.loadSpriteSheet();
    },
    async loadSpriteSheet() {
        spriteSheet.image = new Image();
        // Await loading the image
        spriteSheet.image.decode().then(()=>{
            spriteSheet.height = spriteSheet.image.height;
            spriteSheet.width = spriteSheet.image.width;
            this.indexer();
        }).catch((encodingError)=>{
            console.log("Error while loading spritesheet: " + encodingError);
            throw encodingError;
        });
        spriteSheet.image.src = spriteSheet.source;
    },
    indexer() {
        const row_count = Math.floor(spriteSheet.height / spriteSheet.tileSize);
        const column_count = Math.floor(spriteSheet.width / spriteSheet.tileSize);
        // Gets number of sprites
        const sprite_segments = row_count * column_count;
        // Uses 1 based indexing
        for (let index = 1; index < sprite_segments; index++)
        {
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
            const index_row = (row_Number * spriteSheet.tileSize);
            const index_column = (column_Number * spriteSheet.tileSize);
            // Add the coordinate to the matrix
            /**
             * Cross reference for V1's SpriteSheetIndexer
             * rowIndex = y,
             * columnIndex = x
             */
            spriteSheet.indexMatrix.push({x: index_column, y: index_row});
        }
    }
};