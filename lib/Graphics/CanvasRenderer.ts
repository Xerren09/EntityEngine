export default class CanvasRenderer {
    /**
     * The HTML Canvas instance the engine will render frames on.
     */
    public readonly Canvas: HTMLCanvasElement;
    /**
     * The rendering context for {@link Canvas}.
     */
    public readonly Context: CanvasRenderingContext2D;
    /**
     * An OffscreenCanvas instance where individual Entities are rendered. 
     * Each entity's render is then transferred to {@link Canvas} and drawn on top of previous ones.
     */
    private readonly _shadowCanvas: OffscreenCanvas;
    public readonly ShadowContext: OffscreenCanvasRenderingContext2D;
    /**
     * Contains a set of engine specific options for rendering.
     */
    public options: RendererOptions = {};

    constructor(htmlCanvasID: string) {
        const canvas = document.getElementById(htmlCanvasID) as HTMLCanvasElement;
        if (canvas == undefined) {
            throw new Error(`No canvas with the ID "${htmlCanvasID}" could be found on the current document.`);
        }
        this.Canvas = canvas;
        this.Canvas.width = this.Canvas.offsetWidth;
        this.Canvas.height = this.Canvas.offsetHeight;
        this.Context = this.Canvas.getContext("2d");
        this._shadowCanvas = new OffscreenCanvas(this.Canvas.width, this.Canvas.height);
        this.ShadowContext = this._shadowCanvas.getContext("2d");
    }

    /**
     * Changes the canvas' render size to match its real size.
     */
    public refit(height?: number, width?: number) {
        this.Canvas.height = height === undefined ? this.Canvas.offsetHeight : height;
        this.Canvas.width = width === undefined ? this.Canvas.offsetWidth : width;
        //
        this._shadowCanvas.height = this.Canvas.height;
        this._shadowCanvas.width = this.Canvas.width;
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