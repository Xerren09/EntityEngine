/**
 * Provides the frame timing and statistics mechanism.
 */
export class EngineTiming {
    private _targetFramerate: number = 60;
    private _targetFrametimeAllocation: number = (1000 / this._targetFramerate);
    private _targetFrametimeAllocationEnough: boolean = true;

    private _frameTimeRollingAverageIndex: number = -1;
    private _frameTimeRollingAverageArr: number[] = new Array(this._targetFramerate);
    private _frameTimeAverage: number = 0;

    private _frameDelta: number = 0;
    private _frameDeltaMs: number = 0;

    private _frameStart: number = 0;
    private _cycleExecuteTime: number = 0;
    private _renderTime: number = 0;
    private _customRenderTimeLength: number = 0;
    private _frameEnd: number = 0;
    private _totalFrameTime: number = 0;

    /**
     * The internal engine loop's desired frequency. The engine may run slower than this, but never faster.
     */
    public get targetFramerate(): number {
        return this._targetFramerate;
    }
    public set targetFramerate(value: number) {
        this._targetFramerate = value;
        this._targetFrametimeAllocation = 1000 / value;
        this._frameTimeRollingAverageArr.length = value;
    }

    /**
     * The maximum frame time in milliseconds allocated with the current targeted framerate.
     * 
     * See {@link isFrameTimeAllocationEnough} to check if the previous frame's execution fit into this time window.
     */
    public get targetFrametimeAllocation(): number {
        return this._targetFrametimeAllocation;
    }

    /**
     * Whether the current frame's execution time fit within the targeted framerate; that is if the targeted framerate is being met.
     */
    public get isFrameTimeAllocationEnough(): boolean {
        return this._targetFrametimeAllocationEnough;
    }

    /**
     * The time elapsed since the previous frame's start, in milliseconds.
     */
    public get frameDeltaMs(): number {
        return this._frameDeltaMs;
    }
    /**
     * The time elapsed since the previous frame's start, in seconds.
     */
    public get frameDelta(): number {
        return this._frameDelta;
    }

    /**
     * The start timestamp of the current frame.
     */
    public get frameStartTime(): number {
        return this._frameStart;
    }

    /**
     * The previous frame's total execution time.
     */
    public get frameTime(): number {
        return this._totalFrameTime;
    }

    /**
     * The previous frame's time spent running game code.
     */
    public get updateTime(): number {
        return this._cycleExecuteTime;
    }

    /**
     * The previous frame's time spent doing engine rendering.
     */
    public get renderTime(): number {
        return this._renderTime;
    }

    /**
     * The previous frame's time spent doing custom rendering.
     */
    public get customRenderTime(): number {
        return this._customRenderTimeLength;
    }

    /**
     * The one second rolling average of total frame execution times.
     */
    public get frameTimeAverage(): number {
        return this._frameTimeAverage;
    }

    /**
     * Prints a warning to the browser console if the browser's time API is returning low accuracy (rounded to 1ms) timing.
     * 
     * At high enough framerate the time resolution may not be low enough to accurately calculate performance metrics during a single frame's execution,
     * but the general frame delta should stay accurate.
     * 
     * This mainly applies to Firefox, as the `performance.now()` time resolution is reduced to whole milliseconds. 
     * The timestamp passed by `requestAnimationFrame()` is unaffected, so frame timing remains correct.
     * 
     * {@link https://developer.mozilla.org/en-US/docs/Web/API/Performance/now#browser_compatibility} 
     */
    public static checkTimingApiPrecision() {
        const timestamp = performance.now();
        const islowAccuracy = Number.isInteger(timestamp);
        if (islowAccuracy) {
            console.warn("Your browser is using a reduced accuracy timing API; some engine timing statistics may be inaccurate.");
        }
    }

    private getFrameTimeAverage(): number {
        let i = 0;
        let avg = 0;
        while (i < this._frameTimeRollingAverageArr.length) {
            avg += this._frameTimeRollingAverageArr[i];
            i++;
        }
        return avg / this._frameTimeRollingAverageArr.length;
    }

    public frameStart(time?: number) {
        time ??= performance.now();
        // Calculate frame deltas
        this._frameDeltaMs = time - this._frameStart;
        this._frameDelta = this._frameDeltaMs / 1000;
        //
        this._frameStart = time;
    }

    public frameUpdate(time?: number) {
        time ??= performance.now();
        this._cycleExecuteTime = time - this._frameStart;
    }

    public frameRender(time?: number) {
        time ??= performance.now();
        this._renderTime = time - (this._frameStart + this._cycleExecuteTime);
    }

    public frameEnd(time?: number) {
        time ??= performance.now();
        this._frameEnd = time;
        this._totalFrameTime = time - this._frameStart;
        this._targetFrametimeAllocationEnough = this._totalFrameTime <= this._targetFrametimeAllocation;
        // Calculate custom render timing
        this._customRenderTimeLength = time - (this._frameStart + this._cycleExecuteTime + this._renderTime);
        // Calculate rolling average
        this._frameTimeRollingAverageIndex = (this._frameTimeRollingAverageIndex + 1) % this._frameTimeRollingAverageArr.length;
        this._frameTimeRollingAverageArr[this._frameTimeRollingAverageIndex] = this._totalFrameTime;
        this._frameTimeAverage = this.getFrameTimeAverage();
    }

    /**
     * Resets the timing to use the given base time. This is used to avoid a big jump in frame delta when restarting the engine after a pause.
     * @param time 
     */
    public reset(time?: number) {
        time ??= performance.now();
        this._frameEnd = 0;
        this._frameStart = time;
    }
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
export class FrameTime {
    private _provider: EngineTiming;

    constructor(provider: EngineTiming) {
        this._provider = provider;
    }

    /**
     * Returns the milliseconds elapsed since the last frame.
     * @returns 
     */
    public get ms(): number {
        return this._provider.frameDeltaMs;
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
        return this._provider.frameDelta;
    }

    /**
     * Gets the current time allocation per frame at the target framerate.
     */
    public get frameTimeAllocation() {
        return this._provider.targetFrametimeAllocation;
    }

    /**
     * Checks if the last frame's execution time fits the {@link frameTimeAllocation}. 
     * If the result is often false, lower the target framerate for a smoother experience.
     */
    public get isFrameTimeAllocationEnough() : boolean {
        return this._provider.isFrameTimeAllocationEnough;
    }

    /**
     * Gets the last frame's total execution time.
     */
    public get lastFrameTime() {
        return this._provider.frameTime;
    }

    /**
     * Gets the last frame's total game code execution time (time it took for all Update handlers to complete).
     */
    public get lastUpdateTime() {
        return this._provider.updateTime;
    }

    /**
     * Gets the last frame's total rendering time.
     */
    public get lastRenderTime() {
        return this._provider.renderTime;
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

FrameTime.prototype.valueOf = function () {
    return this.delta;
}