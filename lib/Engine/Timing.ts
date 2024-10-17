export class EngineTiming {
    /**
     * The internal engine loop's desired frequency. The engine may run slower than this, but never faster.
     */
    public targetFramerate: number = 60;

    /**
     * The previous frame's completion timestamp.
     */
    public previous: number = 0;
    /**
     * The current frame's start timestamp.
     */
    public current: number = 0;

    public lastFrameTime: number = 0;
    public lastUpdateTime: number = 0;
    public lastRenderTime: number = 0;
}

/**
 * Returns the time elapsed since the last frame in seconds. 
 * 
 * This can be used for moving entities at a fixed stepsize regardless of framerate by multiplying the stepsize with the returned value:
 * 
 * ```js
 * const step = 10; // The number of pixels the entity should move per second.
 * entity.MoveTowards(targetPoint, step * time.delta);
 * ```
 */
export class EngineTime {
    private _provider: EngineTiming;

    constructor(provider: EngineTiming) {
        this._provider = provider;
    }

    /**
     * Returns the milliseconds elapsed since the last frame.
     * @returns 
     */
    public get ms(): number {
        return this._provider.current - this._provider.previous;
    }

    /**
     * Returns the time elapsed since the last frame in seconds. 
     * 
     * This can be used for moving entities at a fixed stepsize regardless of framerate by multiplying the stepsize with the returned value:
     * 
     * ```js
     * const step = 10; // The number of pixels the entity should move per second.
     * entity.MoveTowards(targetPoint, step * time.delta);
     * ```
     * @returns 
     */
    public get delta(): number {
        return (this._provider.current - this._provider.previous) / 1000;
    }

    /**
     * Gets the current time allocation per frame at the target framerate.
     */
    public get frameTimeAllocation() {
        return (1000 / this._provider.targetFramerate);
    }

    /**
     * Checks if the last frame's execution time fits the {@link frameTimeAllocation}. 
     * If the result is often false, lower the target framerate for a smoother experience.
     */
    public get isFrameTimeAllocationEnough() : boolean {
        return (this._provider.lastFrameTime < this.frameTimeAllocation);
    }

    /**
     * Gets the last frame's total execution time.
     */
    public get lastFrameTime() {
        return this._provider.lastFrameTime;
    }

    /**
     * Gets the last frame's total game code execution time (time it took for all Update handlers to complete).
     */
    public get lastUpdateTime() {
        return this._provider.lastUpdateTime;
    }

    /**
     * Gets the last frame's total rendering time.
     */
    public get lastRenderTime() {
        return this._provider.lastRenderTime;
    }

    [Symbol.toPrimitive](hint: 'number' | 'string' | 'default') {
        if (hint === 'number') {
            return this.delta;
        }
        if (hint === 'string') {
            return `${this.delta}`;
        }
        return this.delta;
    }
}

EngineTime.prototype.valueOf = function () {
    return this.delta;
}