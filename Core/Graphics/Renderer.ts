import { EntityList } from '../Entities/Entities.js';
import { AnimatedSprite } from '../Sprites/AnimatedSprite.js';
import { Sprite } from '../Sprites/Sprite.js';
import { SpriteSheets } from '../Sprites/Sprites.js';
import { CanvasRenderer } from './CanvasRenderer.js';

export function Render(renderer: CanvasRenderer) {
    // Clear canvas
    renderer.Context.clearRect(0, 0, renderer.Canvas.width, renderer.Canvas.height);

    EntityList.forEach(entity => {
        // Get sprite's data
        const entitySprite = entity.Sprite;
        const entitySpriteSheet = SpriteSheets.Find(entitySprite.SpriteSheetID);
        let tileSize = entity.Size;
        if (entitySpriteSheet) {
            tileSize = entitySpriteSheet.TileSize;
        }
        // Get the object's width and height in terms of number of segments
        let objectColumnNumber = Math.floor(entity.Size.width / tileSize.width);
        let objectRowNumber = Math.floor(entity.Size.height / tileSize.height);
        // Loop through every row of the object's height
        for (let heightIndex = 0; heightIndex < (objectRowNumber); heightIndex++) {
            const pos_y = (entity.Vertices[0].y) + (heightIndex * tileSize.height);
            // Loop through every column of the object's width
            for (let widthIndex = 0; widthIndex < (objectColumnNumber); widthIndex++) {
                const pos_x = (entity.Vertices[0].x) + (widthIndex * tileSize.width);
                // Get the sprite segment to be rendered
                let spriteValue: number | string;
                if (("Speed" in entitySprite)) {
                    // Animated sprite
                    spriteValue = (<AnimatedSprite>entitySprite).Value;
                }
                else {
                    // Normal sprite
                    // Index of item (can wrap around freely)
                    let index = widthIndex % (<Sprite>entitySprite).Contents.length;
                    spriteValue = (<Sprite>entitySprite).Contents[index];
                }
                if (typeof spriteValue === "string") {
                    // If element is single colour, render it as a simple square
                    renderer.Context.beginPath();
                    renderer.Context.rect(pos_x, pos_y, tileSize.width, tileSize.height);
                    renderer.Context.fillStyle = spriteValue;
                    renderer.Context.fill();
                    renderer.Context.closePath();
                }
                else if (typeof spriteValue === "number") {
                    // If element is a spritesheet index, render it as an image
                    let spriteLocation = entitySpriteSheet.GetSpriteCoordinates(spriteValue);
                    renderer.Context.drawImage(entitySpriteSheet.Image, spriteLocation.x, spriteLocation.y, tileSize.width, tileSize.height, pos_x, pos_y, tileSize.width, tileSize.height);
                }
            }
        }
        renderer.Context.beginPath();
        renderer.Context.arc(entity.Position.x, entity.Position.y, 2, 0, 360);
        renderer.Context.fillStyle = "#FF00FF";
        renderer.Context.fill();
        renderer.Context.closePath();
    });
}