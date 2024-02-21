import { EntityManager } from '../Entities/Entities.js';
import Entity from '../Entities/Entity.js';
import { CalculateRectangleAroundPoint, RectCollider } from '../Entities/Collision/Colliders/Rectangle.js';
import AnimatedSprite from '../Sprites/AnimatedSprite.js';
import Sprite from '../Sprites/Sprite.js';
import { HexColor, rectSize, vector2D } from '../Types/Types.js';
import { CanvasRenderer } from './CanvasRenderer.js';
import { CircleCollider } from '../Entities/Collision/Colliders/Circle.js';

export default function Render(renderer: CanvasRenderer, entities: EntityManager) {
    /**
     * The main rendering context, belonging to the renderer's attached canvas.
     */
    const ctx = renderer.context;
    ctx.clearRect(0, 0, renderer.canvas.width, renderer.canvas.height);
    drawCircle(ctx, {x: 0, y:0}, 50, "#FFFFFF");
    //
    //const entities_safe = [...entities.List];
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
            ctx.fillStyle = sprite._content;
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
            const renderPosition = entity.Rotation !== 0 ? { x: 0, y: 0 } : entity.Position;
            if (renderer.options.drawEntityBounds) {
                RenderDebugShapeOutline(CalculateRectangleAroundPoint(entity.Size, renderPosition), renderPosition, ctx);
            }
            if (renderer.options.drawColliders) {
                RenderDebugColliderOutline(entity, renderPosition, ctx);
            } 
        }
    }  
}

function getSpriteValue(sprite: Sprite, index: number): number | string
{
    if ((sprite instanceof AnimatedSprite)) {
        return sprite.value;
    }
    else {
        // Normal sprite
        // Wrap index around to repeat pattern
        let spriteIndex = index % sprite.content.length;
        return sprite.content[spriteIndex];
    }
}

function RenderDebugShapeOutline(vertices: ReadonlyArray<vector2D>, position: vector2D, ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D) {
    // Render center point

    drawCircle(ctx, position, 4, "#FF00FF");
    
    // Render edges
    for (let index = 0; index < vertices.length; index++) {
        const current = vertices[index];
        const next = vertices[(index + 1) % (vertices.length)];
        // Render vertex
        drawCircle(ctx, current, 4, "#FF00FF");
        // Render edge
        ctx.beginPath();
        ctx.lineWidth = 2;
        ctx.strokeStyle = "#FF00FF";
        ctx.moveTo(current.x, current.y);
        ctx.lineTo(next.x, next.y);
        ctx.stroke();
        ctx.closePath();
    }
}

function RenderDebugColliderOutline(target: Entity, position: vector2D, ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D) {
    if (target.Collider === undefined)
        return;

    drawCircle(ctx, target.Collider.position, 2, "#00FF00");
    if (target.Collider instanceof CircleCollider) {
        drawCircle(ctx, target.Collider.position, target.Collider.radius, "#00FF00", false);
        
    }

    if (target.Collider instanceof RectCollider) {
        const rect = target.Collider.resolve();
        
        // Render edges
        for (let index = 0; index < rect.vertices.length; index++) {
            const current = rect.vertices[index];
            const next = rect.vertices[(index + 1) % (rect.vertices.length)];
            // Render vertex
            drawCircle(ctx, current, 2, "#00FF00");
            // Render edge
            ctx.beginPath();
            ctx.lineWidth = 1;
            ctx.strokeStyle = "#00FF00";
            ctx.moveTo(current.x, current.y);
            ctx.lineTo(next.x, next.y);
            ctx.stroke();
            ctx.closePath();
        }
        
    }
}

//
function drawCircle(ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D, pos: vector2D, radius: number, colour: HexColor, fill: boolean = true) {
    ctx.beginPath();
    ctx.arc(pos.x, pos.y, radius, 0, 360);
    if (fill) {
        ctx.fillStyle = colour;
        ctx.fill();
    }
    else {
        ctx.strokeStyle = colour;
        ctx.stroke();
    }
    ctx.closePath();
}