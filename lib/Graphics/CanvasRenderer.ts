export default class CanvasRenderer {
    public readonly Canvas: HTMLCanvasElement;
    public readonly Context: CanvasRenderingContext2D;

    constructor(htmlCanvasID: string) {
        const canvas = <HTMLCanvasElement>document.getElementById(htmlCanvasID);
        if (canvas == null) {
            console.error(`No canvas with the ID "${htmlCanvasID}" could be found on the current document.`);
        }
        else {
            this.Canvas = canvas;
            this.Canvas.width = this.Canvas.offsetWidth;
            this.Canvas.height = this.Canvas.offsetHeight;
            this.Context = this.Canvas.getContext("2d");
        }
    }
}