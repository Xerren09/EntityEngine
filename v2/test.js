import {gameObject, sprite, engine} from "./engine.js";

engine.setSpriteSheet("spritesheet.png", 25);

let player;

engine.initialise = ()=>{
    gameObject.new("test", 50, 50, 25, 25, "testTag", "testSprite_blue");
    gameObject.new("test3", 200, 120, 25, 25, "testTag", "testSprite_red");
    gameObject.new("test2", 55, 55, 100, 100, "testTag2", "testSprite_green_anim");
    sprite.new.normal("testSprite_blue", "#0000FF");
    sprite.new.normal("testSprite_red", "#FF0000");
    sprite.new.animated("testSprite_green_anim", 500, "#FF0000", "#00FF00", "#0000FF");
    sprite.new.animated("testSprite_green_anim2", 500, 1, 2, 3, 5, 6, 7);
    player = gameObject.find("test");
};

engine.update = ()=>{
    //player.translate(1, 1);
    console.log(player.collision("testTag2").length != 0, player.x, player.y);
    //console.log(engine.performance());
    gameObject.find("test3").moveTowards(player, 10 * engine.deltaTime().sec);
    //console.log(gameObject.find("test3").x);
};

engine.start();

const keyList = [];

window.addEventListener("keydown", function (event) {
    if (event.defaultPrevented) {
        return;
    }
    let vector = {
        x: 0,
        y: 0
    }
    switch (event.code) {
        case "KeyW":
            vector.y += -1;
            break;
        case "KeyS":
            vector.y += 1;
            break;
        case "KeyA":
            vector.x += -1;
            break;
        case "KeyD":
            vector.x += 1;
            break;
    }
    player.translate(vector.x, vector.y);
    //event.preventDefault();
}, true);