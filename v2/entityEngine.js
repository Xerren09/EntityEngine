import * as _engine from "./engine.js";

const engine = {
    deltaTime() {
        const delta = _engine.enginePerformance.deltaTime();
        return delta;
    },
    setSpriteSheet(imgSource="", tileSize=-1) {
        _engine.setSpriteSheet(imgSource, tileSize);
    }
};

const gameObject = _engine.gameObject;
const sprite = _engine.sprite;

export {}