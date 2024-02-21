export class CanvasRenderer {
    /**
     * The HTML Canvas instance the engine will render frames on.
     */
    public readonly canvas: HTMLCanvasElement;
    /**
     * The rendering context for {@link canvas}.
     */
    public readonly context: CanvasRenderingContext2D;
    /**
     * Contains a set of engine specific options for rendering.
     */
    public options: RendererOptions = {};

    constructor(htmlCanvasID: string) {
        const canvas = document.getElementById(htmlCanvasID) as HTMLCanvasElement;
        if (canvas == undefined) {
            throw new Error(`No canvas with the ID "${htmlCanvasID}" could be found on the current document.`);
        }
        this.canvas = canvas;
        this.canvas.width = this.canvas.offsetWidth;
        this.canvas.height = this.canvas.offsetHeight;
        this.context = this.canvas.getContext("2d");
    }

    /**
     * Changes the canvas' render size to match its real size.
     */
    public refit(height?: number, width?: number) {
        this.canvas.height = height === undefined ? this.canvas.offsetHeight : height;
        this.canvas.width = width === undefined ? this.canvas.offsetWidth : width;
    }
}


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