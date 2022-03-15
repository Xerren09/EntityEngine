import { gameObject, gameObjects } from "./gameObject.js";
import { sprite, sprites, preprocessor, spriteSheet, setSpriteSheet } from "./sprites.js";
import { INTERNAL_DEBUG_AND_VISUALISATION_USE_ONLY, render, renderer, animationUpdateLoop } from "./graphics.js";

const engineCore = {
    targetFrameRate: 60,
    lastExecutionCycle: 0,
    cycleExecute (timeStamp, engineUpdateCycle) {
        let allow = engine.deltaTime().ms >= (1000 / this.targetFrameRate);
        if (this.awaitDuration != 0)
        {
            // Non-thread blocking absolute cutie, I love you.
            if (engine.deltaTime().ms <= this.awaitDuration)
            {
                allow = false;
            }
            else if (engine.deltaTime().ms >= this.awaitDuration)
            {
                this.awaitDuration = 0;
            }
        }
        if (allow)
        {
            engineUpdateCycle();
            if (timeStamp == undefined)
            {
                this.lastExecutionCycle = performance.now();
            }
            else
            {
                this.lastExecutionCycle = timeStamp;
            }
        }
    },
    awaitDuration: 0,
    performance: {
        cycleStart: 0,
        cycleDuration: 0,
        cycleBegin() {
            this.cycleStart = performance.now();
        },
        cycleEnd() {
            this.cycleDuration = performance.now() - this.cycleStart;
        }
    }
}

const engine = {
    deltaTime () {
        const timeStamp = performance.now();
        const deltaTime = timeStamp - engineCore.lastExecutionCycle;
        return {
            sec: deltaTime/1000,
            ms: deltaTime
        };
    },
    performance() {
        return {
            executionTimeMS: engineCore.performance.cycleDuration,
            executionTimeS: engineCore.performance.cycleDuration / 1000,
            frameRate: {
                target: engineCore.targetFrameRate,
                current: 1000 / engineCore.performance.cycleDuration
            }
        };
    },
    setSpriteSheet(imgSource="", tileSize=-1) {
        setSpriteSheet(imgSource, tileSize);
    },
    wait: {
        set(durationMs=0) {
            engineCore.awaitDuration = durationMs;
        },
        cancel() {
            engineCore.awaitDuration = 0;
        }
    },
    start() {
        initialise();
    },
    set update(_func) { _external.update = _func; },
    set initialise(_func) { _external.initialise = _func; },
    set renderCustom(_func) { _external.renderCustom = _func; }
};


function initialise() {
    renderer.set("gameArea");
    preprocessor.run();
    _external.initialise();
    coreUpdateLoop();
}

function coreUpdateLoop(timeStamp) {
    engineCore.cycleExecute(timeStamp, ()=>{
        engineCore.performance.cycleBegin();
        _external.update();
        animationUpdateLoop(gameObjects, sprite);
        //
        render(gameObjects, sprite, spriteSheet);
        //INTERNAL_DEBUG_AND_VISUALISATION_USE_ONLY.visualise(gameObjects, sprite, spriteSheet, 500);
        //
        engineCore.performance.cycleEnd();
    });
    window.requestAnimationFrame(coreUpdateLoop); 
}

const _external = {
    start() {
        initialise();
    },
    update: ()=>{},
    initialise: ()=>{},
    renderCustom: ()=>{}
};

export {gameObject, sprite, engine};