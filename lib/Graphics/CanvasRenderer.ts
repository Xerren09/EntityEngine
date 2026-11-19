import { RectCollider } from "../Entities/Collision/Colliders/Rectangle.js";
import type Entity from "../Entities/Entity.js";
import type { vector2D } from "../Types/Types.js";

/**
 * Provides access to the canvas API attached to an engine instance.
 */
export class CanvasRenderer {
    /**
     * The HTML Canvas instance the engine will render frames on.
     */
    public get canvas(): HTMLCanvasElement {
        return this.context.canvas;
    }
    /**
     * The 2D rendering context for {@link canvas}.
     */
    public readonly context: CanvasRenderingContext2D;
    /**
     * Gets the current size of the canvas in pixels.
     */
    public get size(): vector2D {
        return {
            x: this.context.canvas.width,
            y: this.context.canvas.height
        };
    }

    public get width(): number {
        return this.context.canvas.width;
    }
    public get height(): number {
        return this.context.canvas.height;
    }
    /**
     * Contains a set of engine specific options for rendering.
     */
    public options: RendererOptions = {};

    /**
     * 
     * @param canvas The HTML Canvas Element or its ID within the current document.
     */
    constructor(canvas: string | HTMLCanvasElement) {
        let element: HTMLCanvasElement;
        if (typeof canvas === "string") {
            element = document.getElementById(canvas) as HTMLCanvasElement;
            if (element == undefined) {
                throw new Error(`No canvas with the ID "${canvas}" could be found on the current document.`);
            }
        }
        else {
            if (canvas == undefined) {
                throw new Error(`Provided canvas instance "${canvas}" is not valid.`);
            }
            element = canvas;
        }
        element.width = element.offsetWidth;
        element.height = element.offsetHeight;
        const ctx = element.getContext("2d");
        if (ctx == null) {
            throw new TypeError(`Could not get 2d context from canvas [${element.id}].`);
        }
        this.context = ctx;
    }

    /**
     * Changes the canvas' render size to match its real size.
     */
    public refit(height?: number, width?: number) {
        this.context.canvas.height = height === undefined ? this.context.canvas.offsetHeight : height;
        this.context.canvas.width = width === undefined ? this.context.canvas.offsetWidth : width;
    }
}

/**
 * Contains possible settings for the renderer.
 */
export interface RendererOptions {
    /**
     * Sets whether entities' colliders should be drawn on top of their sprites.
     */
    drawColliders?: boolean;
    /**
     * Sets whether entities' bounds should be drawn on top of their sprites.
     */
    drawEntityBounds?: boolean;
};