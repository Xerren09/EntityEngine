import { Entities } from "../Entities/Entities.js";
import AnimationUpdateLoop from "../Graphics/AnimationUpdateLoop.js";
import CanvasRenderer from "../Graphics/CanvasRenderer.js";
import Render from "../Graphics/Renderer.js";
import { SpriteSheetList, SpriteSheets, _SpriteSheets } from "../Sprites/SpriteSheets.js";

enum ENGINE_EVENTS {
    awake = "awake",
    update = "update",
    customRender = "customRender"
}

type EngineEvents = keyof typeof ENGINE_EVENTS;

export default class EntityEngine {
    private _targetfps: number = 60;
    private _lastCycleExecuteTimestamp: number;
    private _lastCycleExecuteStart: number;
    private _lastCycleExecuteDuration: number;
    private _awaitUntilTimestamp: number = 0;
    private _runEnabled: boolean = true;

    public Awake = () => { };

    public Update = () => { };

    public CustomRender = (renderer: CanvasRenderer) => { };

    public Renderer: CanvasRenderer;

    private CycleExecute = (timeStamp: number) => {
        const msDelta = (this.DeltaTime() * 1000);
        let allow = msDelta >= (1000 / this._targetfps);
        if (this._awaitUntilTimestamp != 0) {
            // Non-thread blocking absolute cutie, I love you.
            if (msDelta < this._awaitUntilTimestamp) {
                allow = false;
            }
            else if (msDelta >= this._awaitUntilTimestamp) {
                this._awaitUntilTimestamp = 0;
            }
        }
        if (allow) {
            this._lastCycleExecuteStart = performance.now();
            // ------
            // Actual update function called now; this is where any gamecode is executed
            this.Update();
            this.dispatchEngineEvent(ENGINE_EVENTS.update);
            // Render entities
            Render(this.Renderer);
            // Update animations
            AnimationUpdateLoop();
            // Call custom render function
            this.dispatchEngineEvent(ENGINE_EVENTS.customRender, this.Renderer.Context);
            this.CustomRender(this.Renderer);
            // ------
            this._lastCycleExecuteDuration = (performance.now() - this._lastCycleExecuteStart);
            if (timeStamp == null) {
                this._lastCycleExecuteTimestamp = performance.now();
            }
            else {
                this._lastCycleExecuteTimestamp = timeStamp;
            }
        }
        if (this._runEnabled) {
            requestAnimationFrame(this.CycleExecute);
        }
        else {
            this._runEnabled = true;
        }
    }

    /**
     * Starts the engine and sets it to its default state. 
     */
    public Start() {
        SpriteSheetList.length = 0;
        this.Entities.Wipe();
        this.Awake();
        this.dispatchEngineEvent(ENGINE_EVENTS.awake);
        this._awaitUntilTimestamp = 0;
        this._lastCycleExecuteTimestamp = 0;
        SpriteSheets.Load().then(() => {
            requestAnimationFrame(this.CycleExecute);
        }).catch((error) => {
            console.error("One or more SpriteSheet(s) failed to load. Make sure the source images can be accessed.");
        });
    }

    /**
     * Stops the engine.
     */
    public Stop() {
        this._runEnabled = true;
        this._awaitUntilTimestamp = 0;
    }

    /**
     * Restarts the engine while keeping its state.
     */
    public Restart() {
        this._runEnabled = true;
        this._awaitUntilTimestamp = 0;
        window.requestAnimationFrame(this.CycleExecute);
    }

    /**
     * Attach the engine instance to an HTML Canvas to draw the frame onto. 
     * @param canvasID
     */
    public AttachToCanvas(canvasID: string) {
        this.Renderer = new CanvasRenderer(canvasID);
    }

    /**
     * Stops engine execution for the specified duration (ms). During this time no new frames are rendered, or game code is executed.
     * @param durationMS 
     */
    public Wait(durationMS: number): number {
        const waitEnd = performance.now() + durationMS;
        this._awaitUntilTimestamp = waitEnd;
        return this._awaitUntilTimestamp;
    }

    /**
     * Cancels Wait. Does not restart execution immediately, but at the next frame render. 
     */
    public CancelWait() {
        this._awaitUntilTimestamp = 0;
    }

    /**
     * Gets the time since the last frame in milliseconds.
     */
    public DeltaTime(): number {
        const timeStamp = performance.now();
        const deltaTime = (timeStamp - this._lastCycleExecuteTimestamp) / 1000;
        return deltaTime;
    }

    /**
     * Gets the time the engine needs to execute a single frame in milliseconds.
     */
    public GetExecutionTime(): number {
        return this._lastCycleExecuteDuration;
    }

    /**
     * Gets the time the engine is idling between frames in milliseconds.
     */
    public GetExecutionIdleTime(): number {
        const frameTimeAllocation = (1000 / this._targetfps);
        const frameIdleTime = frameTimeAllocation - this._lastCycleExecuteDuration;
        return frameIdleTime;
    }

    /**
     * Gets the potential framerate that the engine could currently execute at.
     */
    public GetVirtualFrameRate(): number {
        const fps = (1000 / this._lastCycleExecuteDuration);
        return fps;
    }

    //
    //
    //

    public readonly Entities: Entities;

    public readonly SpriteSheets: _SpriteSheets;

    private readonly _events: EventLists = {
        awake: [],
        update: [],
        customRender: []
    }

    constructor() {
        this.Entities = new Entities();
        this.SpriteSheets = new _SpriteSheets();
    }

    public addEventListener(type: "awake" , listener: () => void): void;
    public addEventListener(type: "update", listener: (delta: number) => void): void;
    public addEventListener(type: "customRender", listener: (renderer: CanvasRenderingContext2D) => void): void;
    public addEventListener(type: "update" | "awake" | "customRender", listener: (...args: any[]) => void) {
        const keyCheck = Object.keys(this._events).find(el => el === type);
        if (keyCheck == undefined)
            throw new Error(`No engine event with the specific type "${type}" exists`);

        if (this._events[type].find(el => el == listener)) {
            console.warn(`This engine event listener instance has already been added to ${type}.`);
            return;
        }
        
        this._events[type].push(listener);
    }

    public removeEventListener(type: "update" | "awake" | "customRender", listener: (...args: any[]) => void) {
        const keyCheck = Object.keys(this._events).find(el => el === type);
        if (keyCheck == undefined)
            throw new Error(`No engine event with the specific type "${type}" exists`);

        const index = this._events[type].findIndex(el => el == listener);
        if (index != -1) {
            this._events[type].splice(index, 1);
        }
    }

    private dispatchEngineEvent(type: ENGINE_EVENTS, ...params: any) {
        const handlers = this._events[type];
        for (const handler of handlers) {
            handler(...params);
        }
    }

}

/**
 * 
 * @param canvasID 
 */
export function createEngine(canvasID?: string) : [EntityEngine, Entities, _SpriteSheets] {
    const engine = new EntityEngine();
    const entities = engine.Entities;
    const spriteSheets = engine.SpriteSheets;
    if (canvasID) {
        engine.AttachToCanvas(canvasID);
    }
    return [
        engine, entities, spriteSheets
    ];
}

interface EventLists {
    [key: string]: Array<(...args: any[]) => void>;
}