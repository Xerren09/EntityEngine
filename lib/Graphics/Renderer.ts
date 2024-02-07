import { Entities } from '../Entities/Entities.js';
import Entity from '../Entities/Entity.js';
import { CalculateRectangleAroundPoint, RectCollider } from '../Entities/Collision/Colliders/Rectangle.js';
import AnimatedSprite from '../Sprites/AnimatedSprite.js';
import Sprite from '../Sprites/Sprite.js';
import { SpriteSheets } from '../Sprites/SpriteSheets.js';
import { rectSize, vector2D } from '../Types/Types.js';
import CanvasRenderer from './CanvasRenderer.js';
import { CircleCollider } from '../Entities/Collision/Colliders/Circle.js';

export default function Render(renderer: CanvasRenderer) {
    // Clear canvas
    renderer.Context.clearRect(0, 0, renderer.Canvas.width, renderer.Canvas.height);
    renderer.ShadowContext.clearRect(0, 0, renderer.Canvas.width, renderer.Canvas.height);
    //
    const eCtx = renderer.ShadowContext;
    const mCtx = renderer.Context;
    //
    const entities = Entities.List;
    for (const entity of entities) {
        // Get sprite's data
        const entitySprite = entity.Sprite;
        const entitySpriteSheet = SpriteSheets.Find(entitySprite.SpriteSheetID);

        let tileSize = entity.Sprite.TileSize;
        // Get the object's width and height in terms of number of segments
        let objectColumnNumber = Math.floor(entity.Size.width / tileSize.width);
        let objectRowNumber = Math.floor(entity.Size.height / tileSize.height);
        const _rectangeCoords = CalculateRectangleAroundPoint(entity.Size,(entity.Rotation !== 0 ? { x: 0, y: 0 } : entity.Position));
        if (entity.Rotation !== 0) {
            eCtx.save();
            eCtx.translate(entity.Position.x, entity.Position.y);
            eCtx.rotate((entity.Rotation * Math.PI) / 180.0);
        }
        // Loop through every row of the object's height
        for (let heightIndex = 0; heightIndex < (objectRowNumber); heightIndex++) {
            let spriteRenderPositionY = (_rectangeCoords[0].y) + (heightIndex * tileSize.height);
            // Loop through every column of the object's width
            for (let widthIndex = 0; widthIndex < (objectColumnNumber); widthIndex++) {
                let spriteRenderPositionX = (_rectangeCoords[0].x) + (widthIndex * tileSize.width);
                // Get the sprite segment to be rendered
                let spriteValue = GetEntitySpriteValue(entity, widthIndex);
                // TODO: crop sprite size if it is outside the bounds of the entity
                // TODO: Add complex shape rendering, so sprites are cut to fit the vertices (even if the sprite is a rectangle, cut it to fit a triangle)
                if (typeof spriteValue === "string") {
                    // If element is single colour, render it as a simple square
                    eCtx.beginPath();
                    eCtx.rect(spriteRenderPositionX, spriteRenderPositionY, tileSize.width, tileSize.height);
                    eCtx.fillStyle = spriteValue;
                    eCtx.fill();
                    eCtx.closePath();
                }
                else if (typeof spriteValue === "number") {
                    // If element is a spritesheet index, render it as an image
                    let spriteLocation = entitySpriteSheet.GetSpriteCoordinates(spriteValue);
                    eCtx.drawImage(
                        entitySpriteSheet.Image,
                        spriteLocation.x,
                        spriteLocation.y,
                        tileSize.width,
                        tileSize.height,
                        spriteRenderPositionX,
                        spriteRenderPositionY,
                        tileSize.width,
                        tileSize.height
                    );
                }
            }
        }
        // TODO: respect renderer.options
        
        if (renderer.options.drawEntityBounds) {
            if (entity.Rotation !== 0) {
                RenderDebugShapeOutline(_rectangeCoords, { x: 0, y: 0}, eCtx);
            }
            else {
                RenderDebugShapeOutline(_rectangeCoords, entity.Position, eCtx);
            }
        }
        if (entity.Rotation !== 0) {
            eCtx.restore();
        }
        // Transfer frame from shadow canvas to main
        let frame = eCtx.canvas.transferToImageBitmap();
        mCtx.drawImage(
            frame,
            0,
            0,
            frame.width,
            frame.height,
            0,
            0,
            renderer.Canvas.width,
            renderer.Canvas.height
        );
        frame.close();
        if (renderer.options.drawColliders) {
            if (entity.Rotation !== 0) {
                RenderCollider(entity,{ x: 0, y: 0}, mCtx);
            }
            else {
                RenderCollider(entity, entity.Position, mCtx);
            }
        }
        //
        /*
        renderer.Context.beginPath();
        renderer.Context.arc(entity.Position.x, entity.Position.y, 2, 0, 360);
        renderer.Context.fillStyle = "#FF00FF";
        renderer.Context.fill();
        renderer.Context.closePath();
        */   
    }
}

function GetEntityRenderTileSize(entity: Entity): rectSize
{
    // TODO: replace entity.Size with a proper tileSize
    if (entity.Sprite.SpriteSheetID === "") {
        return entity.Size;
    }
    else {
        let entitySpriteSheet = SpriteSheets.Find(entity.Sprite.SpriteSheetID);
        return entitySpriteSheet.TileSize;
    }
} 

function GetEntitySpriteValue(entity: Entity, index: number): number | string
{
    if (("Speed" in entity.Sprite)) {
        // Animated sprite
        return (<AnimatedSprite>entity.Sprite).Value;
    }
    else {
        // Normal sprite
        let sprite = <Sprite>entity.Sprite;
        // Index of item (can wrap around freely)
        let spriteIndex = index % sprite.Contents.length;
        return sprite.Contents[spriteIndex];
    }
}

function RenderDebugShapeOutline(vertices: ReadonlyArray<vector2D>, position: vector2D, ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D) {
    // Render center point
    ctx.beginPath();
    ctx.arc(position.x, position.y, 3, 0, 360);
    ctx.fillStyle = "#FF00FF";
    ctx.fill();
    ctx.closePath();
    ctx.beginPath();
    // Render edges
    for (let index = 0; index < vertices.length; index++) {
        const current = vertices[index];
        const next = vertices[(index + 1) % (vertices.length)];
        // Render vertex
        ctx.arc(current.x, current.y, 3, 0, 360);
        ctx.fillStyle = "#FF00FF";
        ctx.fill();
        // Render edge
        ctx.lineWidth = 2;
        ctx.strokeStyle = "#FF00FF";
        ctx.moveTo(current.x, current.y);
        ctx.lineTo(next.x, next.y);
        ctx.stroke();
    }
    ctx.closePath();
}

function RenderCollider(target: Entity, position: vector2D, ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D) {
    if (target.Collider === undefined)
        return;

    if (target.Collider instanceof CircleCollider) {
        ctx.beginPath();
        ctx.strokeStyle = "#00FF00";
        ctx.arc(target.Collider.position.x, target.Collider.position.y, target.Collider.radius, 0, 360);
        ctx.stroke();
        ctx.closePath();
        ctx.beginPath();
        ctx.arc(target.Collider.position.x, target.Collider.position.y, 3, 0, 360);
        ctx.fill();
        ctx.closePath();
    }

    if (target.Collider instanceof RectCollider) {
        const rect = target.Collider.resolve();
        ctx.beginPath();
        // Render edges
        for (let index = 0; index < rect.vertices.length; index++) {
            const current = rect.vertices[index];
            const next = rect.vertices[(index + 1) % (rect.vertices.length)];
            // Render vertex
            ctx.arc(current.x, current.y, 3, 0, 360);
            ctx.fillStyle = "#00FF00";
            ctx.fill();
            // Render edge
            ctx.lineWidth = 2;
            ctx.strokeStyle = "#00FF00";
            ctx.moveTo(current.x, current.y);
            ctx.lineTo(next.x, next.y);
            ctx.stroke();
        }
        ctx.closePath();
    }

    
}