export const renderer = {
    set(canvasName) {
        this.canvas = document.getElementById(canvasName);
        this.context = this.canvas.getContext("2d");
    },
    canvas: undefined,
    context: undefined
}

export function render(gameObjects, sprite, spriteSheet) {
    if (spriteSheet.indexMatrix.length != 0)
    {
        const tileSize = spriteSheet.tileSize;
        renderer.context.clearRect(0, 0, renderer.canvas.width, renderer.canvas.height);
        gameObjects.forEach(object => {
            // Get sprite's data
            const objectSprite = sprite.find(object.sprite.name);
            // Get the object's width and height in terms of number of segments
            const objectColumnNumber = Math.floor(object.width / tileSize);
            const objectRowNumber = Math.floor(object.height / tileSize);
            // Loop through every row of the object's height
            for (let heightIndex = 0; heightIndex < (objectRowNumber); heightIndex++) {
                const pos_y = object.y + (heightIndex * tileSize);
                // Loop through every column of the object's width
                for (let widthIndex = 0; widthIndex < (objectColumnNumber); widthIndex++) {
                    const pos_x = object.x + (widthIndex * tileSize);
                    // Check if the sprite is animated or not; and get the appropriate index of the item that should be used
                    let spriteIndex = 0;
                    if (objectSprite.animated == false)
                    {
                        // Index of item (can wrap around freely)
                        spriteIndex = (widthIndex % objectSprite.items.length);
                    }
                    else if (objectSprite.animated == true)
                    {
                        // Current animation frame
                        spriteIndex = object.sprite.index;
                    }
                    // Get the item to be rendered
                    const segmentSprite = objectSprite.items[spriteIndex];
                    if (segmentSprite.toString()[0] == "#")
                    {
                        // If element is single colour, render it as a simple square
                        renderer.context.beginPath();
                        renderer.context.rect(pos_x, pos_y, tileSize, tileSize);
                        renderer.context.fillStyle = segmentSprite;
                        renderer.context.fill();
                        renderer.context.closePath();
                    }
                    else if (Number.isInteger(segmentSprite))
                    {
                        // If element is a spritesheet index, render is as an image
                        renderer.context.drawImage(spriteSheet.image, spriteSheet.indexMatrix[segmentSprite-1].x, spriteSheet.indexMatrix[segmentSprite-1].y, tileSize, tileSize, pos_x, pos_y, tileSize, tileSize);
                    }
                }
            }
        });
    }
}

export function animationUpdateLoop(gameObjects, sprite) {
    gameObjects.forEach(gameObjectElement => {
        const spriteName = gameObjectElement.sprite.name;
        // Get sprite info
        const spriteElement = sprite.find(spriteName);
        // Is animated?
        if (spriteElement.animated)
        {
            // Get how long since the sprite was last updated
            const timeElapsedSinceUpdate = performance.now() - gameObjectElement.sprite.lastUpdate;
            // If it's longer than the animation length, update it again
            if (timeElapsedSinceUpdate >= spriteElement.speed)
            {
                // Check if the animation cycle is at it's end
                if ((gameObjectElement.sprite.index+1) != spriteElement.items.length)
                {
                    gameObjects[gameObjectElement.id].sprite.index += 1;
                    
                }
                else // If yes, reset it to 0
                {
                    gameObjects[gameObjectElement.id].sprite.index = 0;
                }
                // Update the lastUpdate time on the object
                gameObjects[gameObjectElement.id].sprite.lastUpdate = performance.now();
            }
        }
    });
}

export const INTERNAL_DEBUG_AND_VISUALISATION_USE_ONLY = {
    lastObjectIndex: 0,
    lastRenderedObjectAt: 0,
    heightIndex: 0,
    widthIndex: 0,
    visualise (gameObjects, sprite, spriteSheet, speed) {
        if (spriteSheet.indexMatrix.length != 0 ) // && (performance.now() - this.lastRenderedObjectAt) >= speed
        {
            const tileSize = spriteSheet.tileSize;
            if (gameObjects.length == this.lastObjectIndex)
            {
                renderer.context.clearRect(0, 0, renderer.canvas.width, renderer.canvas.height);
                this.lastObjectIndex = 0;
                this.heightIndex = 0;
                this.widthIndex = 0;
            }
            const object = gameObjects[this.lastObjectIndex];
            const objectSprite = sprite.find(object.sprite.name);
            const objectColumnNumber = Math.floor(object.width / tileSize);
            const objectRowNumber = Math.floor(object.height / tileSize);
            const heightIndex = this.heightIndex;
            const widthIndex = this.widthIndex;
            const pos_y = object.y + (heightIndex * tileSize);
            const pos_x = object.x + (widthIndex * tileSize);
            let spriteIndex = 0;
            if (objectSprite.animated == false)
            {
                spriteIndex = (widthIndex % objectSprite.items.length);
            }
            else if (objectSprite.animated == true)
            {
                spriteIndex = object.sprite.index;
            }
            const segmentSprite = objectSprite.items[spriteIndex];
            if (segmentSprite.toString()[0] == "#")
            {
                renderer.context.beginPath();
                renderer.context.rect(pos_x, pos_y, tileSize, tileSize);
                renderer.context.fillStyle = segmentSprite;
                renderer.context.fill();
                renderer.context.closePath();
            }
            else if (Number.isInteger(segmentSprite))
            {
                renderer.context.drawImage(spriteSheet.image, spriteSheet.indexMatrix[segmentSprite-1].x, spriteSheet.indexMatrix[segmentSprite-1].y, tileSize, tileSize, pos_x, pos_y, tileSize, tileSize);
            }
            this.widthIndex++;
            if (this.widthIndex == objectColumnNumber)
            {
                this.widthIndex = 0;
                this.heightIndex++;
            }
            if (this.heightIndex == objectRowNumber)
            {
                this.heightIndex = 0;
                this.lastObjectIndex++;
            }
            this.lastRenderedObjectAt = performance.now();
        }
    }
}