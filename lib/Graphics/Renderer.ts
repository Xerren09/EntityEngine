import { EntityManager } from '../Entities/Entities.js';
import { RectCollider } from '../Entities/Collision/Colliders/Rectangle.js';
import { HexColor, rectSize, vector2D } from '../Types/Types.js';
import { CanvasRenderer } from './CanvasRenderer.js';
import { CircleCollider } from '../Entities/Collision/Colliders/Circle.js';

export default function Render(renderer: CanvasRenderer, entities: EntityManager) {
    renderer.context.resetTransform();
    /**
     * The main rendering context, belonging to the renderer's attached canvas.
     */
    const ctx = renderer.context;
    ctx.clearRect(0, 0, renderer.canvas.width, renderer.canvas.height);
    //
    for (const entity of entities.List) {
        if (entity.Sprite) {
            //
            ctx.save();
            //
            const sprite = entity.Sprite;
            const alpha = sprite.opacity;
            //
            const renderSize = entity.Size;
            //
            ctx.globalAlpha = alpha;
            // Calculate rectangle in real world space if no rotation is applied, otherwise use canvas 0,0
            const renderOrigin: vector2D = {
                x: (entity.Rotation !== 0 ? 0 : entity.Position.x) - (renderSize.width / 2),
                y: (entity.Rotation !== 0 ? 0 : entity.Position.y) - (renderSize.height / 2)
            };
            // If the object is rotated, rotate the canvas and then move its origin to the object's coordinates
            if (entity.Rotation !== 0) {
                ctx.translate(entity.Position.x, entity.Position.y);
                ctx.rotate((entity.Rotation * Math.PI) / 180.0);
            }
            ctx.translate(renderOrigin.x, renderOrigin.y);
            ctx.fillStyle = sprite.value;
            ctx.fillRect(0, 0, renderSize.width, renderSize.height);
            ctx.restore();
        }
    }
    // Run debug markers
    if (
        renderer.options.drawEntityBounds ||
        renderer.options.drawColliders
    ) {
        for (const entity of entities.List) {
            if (renderer.options.drawEntityBounds) {
                drawRect(ctx, entity.Position, entity.Size, entity.Rotation, "#FF00FF", false, 2.5);
                drawCircle(ctx, entity.Position, 2, "#FF00FF", false, 2);
            }
            if (renderer.options.drawColliders) {
                if (entity.Collider !== undefined) {
                    drawCircle(ctx, entity.Position, 1, "#00FF00", false, 2);
                    if (entity.Collider instanceof RectCollider) {
                        drawRect(ctx, entity.Position, entity.Collider.rectSize, entity.Rotation, "#00FF00", false, 2);
                    }
                    else if (entity.Collider instanceof CircleCollider) {
                        drawCircle(ctx, entity.Position, entity.Collider.radius, "#00FF00", false, 2);
                    }
                }
            } 
        }
    }  
}

/**
 * Draws a circle.
 * @param ctx The target canvas' renderer context.
 * @param pos The circle's position.
 * @param radius 
 * @param colour The colour of the circle.
 * @param fill Whether the circle should be filled or not.
 */
export function drawCircle(ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D, pos: vector2D, radius: number, colour: HexColor, fill: boolean = false, strokeWidth: number = 2) {
    ctx.beginPath();
    ctx.arc(pos.x, pos.y, radius, 0, 360);
    if (fill) {
        ctx.fillStyle = colour;
        ctx.fill();
    }
    else {
        ctx.strokeStyle = colour;
        ctx.lineWidth = strokeWidth;
        ctx.stroke();
    }
    ctx.closePath();
}

/**
 * Draws a rect.
 * @param ctx The target canvas' renderer context.
 * @param pos The rect's center's position.
 * @param size The width and height of the rect.
 * @param rotation Rotation in degrees.
 * @param colour The colour of the rect.
 * @param fill Whether the rect should be filled or not.
 */
export function drawRect(ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D, pos: vector2D, size: rectSize, rotation: number, colour: HexColor, fill: boolean = false, strokeWidth: number = 2) {
    ctx.beginPath();
    ctx.save();
    const renderOrigin: vector2D = {
        x: (rotation !== 0 ? 0 : pos.x) - (size.width / 2),
        y: (rotation !== 0 ? 0 : pos.y) - (size.height / 2)
    };
    if (rotation != 0) {
        ctx.translate(pos.x, pos.y);
        ctx.rotate((rotation * Math.PI) / 180.0);
        ctx.translate(renderOrigin.x, renderOrigin.y);
        ctx.rect(0, 0, size.width, size.height);
    }
    else {
        ctx.rect(renderOrigin.x, renderOrigin.y, size.width, size.height);
    }
    if (fill) {
        ctx.fillStyle = colour;
        ctx.fill();
    }
    else {
        ctx.strokeStyle = colour;
        ctx.lineWidth = strokeWidth;
        ctx.stroke();
    }
    ctx.closePath();
    ctx.restore();
}