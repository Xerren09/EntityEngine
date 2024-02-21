import { EntityManager } from "../Entities/Entities.js";
import AnimationUpdateLoop from "../Graphics/AnimationUpdateLoop.js";
import { CanvasRenderer } from "../Graphics/CanvasRenderer.js";
import Render from "../Graphics/Renderer.js";
import { EngineTime, EngineTiming } from "./Timing.js";

enum ENGINE_EVENTS {
    /**
     * 
     */
    awake = "awake",
    /**
     * 
     */
    update = "update",
    /**
     * 
     */
    customRender = "customRender"
}

interface EngineEventBuckets {
    [key: string]: Array<(...args: any[]) => void>;
}

export default class EntityEngine {
    /**
     * Flag to check if the engine was initialised (cold-start).
     */
    private _ENGINE_INIT: boolean = false;
    /**
     * The ID of the {@link requestAnimationFrame} request. Used by {@link stop} to cancel any already registered cycle requests before they are ran.
     */
    private _CE_FRAMEID: number = 0;
    /**
     * Flag to check if {@link CycleExecute} is enabled. If set to false the current cycle may still finish, but no new cycle will be started.
     */
    private _CE_ENABLED: boolean = true;
    /**
     * Flag / timestamp for {@link wait}. The value is a future time until the engine should not invoke `update` and `render` events, but should otherwise run idle cycles. If `null`, no wait is registered.
     */
    private _CE_WAIT: number | null = null;

    /**
     * Contains the registered event handlers.
     */
    private readonly _eventBuckets: EngineEventBuckets = {
        awake: [],
        update: [],
        customRender: []
    }

    /**
     * Keeps track of the engine's internal timings and stats.
     */
    private _timings: EngineTiming = new EngineTiming();
    /**
     * Provides the Time api for `update` events.
     */
    private _delta: EngineTime = new EngineTime(this._timings);

    /**
     * 
     */
    public Renderer: CanvasRenderer;
    /**
     * Manages the Entities visible to the engine.
     * 
     * In order for an Entity to be visible and active, register it via the {@link EntityManager.Register} method.
     */
    public readonly Entities: EntityManager;

    constructor(canvasId?: string) {
        this.Entities = new EntityManager();
        if (canvasId) {
            this.attachToCanvas(canvasId);
        }
    }

    /**
     * Provides the engine's main execution loop.
     * 
     * The engine executes items within a given cycle in the following order:
     * ```
     * Calculate engine timings
     *          ▼
     * Check engine await
     *          ▼
     * Run Update handlers
     *          ▼
     * Run Renderer
     *          ▼
     * Run CustomRender handlers
     * ```
     * @param timeStamp 
     */
    private CycleExecute = (timeStamp: number) => {
        // Calculate delta for this frame
        const lastCycleDeltaMs = (performance.now() - this._timings.previous);
        // Treat _timings.targetFramerate as an FPS cap, and only allow a new cycle if the per frame budget is safe
        let allowExecute = (lastCycleDeltaMs >= (1000 / this._timings.targetFramerate));
        // Handle engine pause
        if (this._CE_WAIT != null) {
            // Non-thread blocking absolute cutie, I love you.
            if (performance.now() < this._CE_WAIT) {
                allowExecute = false;
            }
            else if (performance.now() >= this._CE_WAIT) {
                this.cancelWait();
            }
        }
        if (allowExecute) {
            this._timings.current = timeStamp || performance.now();
            // ------
            // Call `update` handlers, this is where gamecode is executed
            this.dispatchEngineEvent(ENGINE_EVENTS.update, this._delta);
            this._timings.lastUpdateTime = performance.now() - this._timings.current;
            // Run rendering pass
            Render(this.Renderer, this.Entities);
            // Update animated sprites after the rendering pass
            AnimationUpdateLoop(this.Entities);
            this._timings.lastRenderTime = performance.now() - (this._timings.current + this._timings.lastUpdateTime);
            // Call `customRender` handlers
            this.dispatchEngineEvent(ENGINE_EVENTS.customRender, this.Renderer.context);
            // ------
            this._timings.lastFrameTime = performance.now() - this._timings.current;
            this._timings.previous = timeStamp || performance.now();
        }
        if (this._CE_ENABLED) {
            this.NextCycle();
        }
    }

    private NextCycle() {
        this._CE_FRAMEID = requestAnimationFrame(this.CycleExecute);
    }

    /**
     * Starts the engine and calls the `awake` event.
     * 
     * If the engine was stopped previously, this acts as a resume command, and skips calling Awake.
     */
    public start() {
        if (this._ENGINE_INIT == false) {
            // This is a cold start
            this.dispatchEngineEvent(ENGINE_EVENTS.awake);
            this._ENGINE_INIT = true;
        }
        // Prevents the timing scale jumping high on the first frame
        this._timings.previous = performance.now();
        this._CE_ENABLED = true;
        this.cancelWait();
        this.NextCycle();
    }

    /**
     * Stops the engine completely. Use {@link start} to resume.
     */
    public stop() {
        this._CE_ENABLED = false;
        if (this._CE_FRAMEID != 0) {
            window.cancelAnimationFrame(this._CE_FRAMEID);
            this._CE_FRAMEID = 0;
        }
    }

    /**
     * Resets the engine to its default state. 
     * This de-registers all entities, and the next time {@link start} is called the `awake` event will be invoked as well.
     */
    public reset() {
        this.stop();
        this.Entities.Wipe();
        this._ENGINE_INIT = false;
        this.start();
    }

    /**
     * Attach the engine instance to an HTML Canvas to draw the frame onto. 
     * @param canvasID
     */
    public attachToCanvas(canvasID: string) {
        this.Renderer = new CanvasRenderer(canvasID);
    }

    /**
     * Stops engine execution for the specified duration (ms). During this time no new frames are rendered, or game code is executed.
     * @param durationMS 
     */
    public wait(durationMS: number): number {
        this._CE_WAIT = performance.now() + durationMS;
        return this._CE_WAIT;
    }

    /**
     * Cancels the set wait timer. 
     */
    public cancelWait() {
        this._CE_WAIT = null;
    }

    /**
     * Register a listener to the `awake` event. Use this event to safely initialise entities and load anything important. This event fires before the engine actually starts.
     */
    public addEventListener(type: "awake", listener: () => void): void;
    /**
     * Register a listener to the `update` event. This serves as the main update loop of the engine, and will be invoked every frame.
     * Handlers will be called in the order they were registered.
     * 
     * This event is invoked at around same frequency as the set target framerate (according to [requestAnimationFrame's rules](https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame#examples)), but is not fixed. However it will not run more _often_ than the target framerate.
     * 
     * @param listener The listener will be passed a {@link EngineTime} instance that provides - among other things - the time elapsed between frames via the {@link EngineTime.delta} property.
     */
    public addEventListener(type: "update", listener: (time: EngineTime) => void): void;
    /**
     * Register a listener to the `customRender` event. 
     * This event is invoked immediately after rendering the current frame has finished, but before the next frame is started.
     * Use this to display any custom graphics on top of the rendered frame (such as UI).
     * @param listener The listener will be passed the attached canvas' {@link CanvasRenderingContext2D} which can be used to draw addition graphics on top of the frame.
     */
    public addEventListener(type: "customRender", listener: (renderer: CanvasRenderingContext2D) => void): void;
    public addEventListener(type: "update" | "awake" | "customRender", listener: (...args: any[]) => void) {
        const keyCheck = Object.keys(this._eventBuckets).find(el => el === type);
        if (keyCheck == undefined)
            throw new Error(`No engine event with the specific type "${type}" exists`);

        if (this._eventBuckets[type].find(el => el == listener)) {
            console.warn(`This engine event listener instance has already been added to ${type}.`);
            return;
        }
        
        this._eventBuckets[type].push(listener);
    }

    /**
     * Removes a registered listener from the given event bucket.
     * @param type 
     * @param listener 
     */
    public removeEventListener(type: "update" | "awake" | "customRender", listener: (...args: any[]) => void) {
        const keyCheck = Object.keys(this._eventBuckets).find(el => el === type);
        if (keyCheck == undefined)
            throw new Error(`No engine event with the specific type "${type}" exists`);

        const index = this._eventBuckets[type].findIndex(el => el == listener);
        if (index != -1) {
            this._eventBuckets[type].splice(index, 1);
        }
    }

    private dispatchEngineEvent(type: ENGINE_EVENTS, ...params: any) {
        const handlers = this._eventBuckets[type];
        for (const handler of handlers) {
            handler(...params);
        }
    }
}