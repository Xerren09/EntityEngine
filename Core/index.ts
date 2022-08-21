import { EntityEngine } from "./Engine/Core.js";
import { Entities } from "./Entities/Entities.js";
import { Entity } from "./Entities/Entity.js";
import { AnimatedSprite } from "./Sprites/AnimatedSprite.js";
import { Sprite } from "./Sprites/Sprite.js";
import { SpriteSheets } from "./Sprites/Sprites.js";
import { SpriteSheet } from "./Sprites/SpriteSheet.js";
import { vector2D } from "./Types/Types.js";


const engine = new EntityEngine();

let player: Entity;
let mousePosition: vector2D = { x: 0, y: 0};

engine.Awake = () => {
    let spriteSheet = new SpriteSheet("testSheet", "spritesheet.png", { width: 25, height: 25 });
    spriteSheet.Load();
    player = new Entity("player");
    SpriteSheets.Register(spriteSheet);
    player.Sprite = new AnimatedSprite("testSprite", 500, [1, 2, 3, 4, 5], "testSheet"); //new Sprite("testSpriteNormal", [1], "testSheet");
    player.Size = { width: 100, height: 25 };
    Entities.Register(player);
    
}

engine.Update = () => {
    player.MoveTowards(mousePosition,( 10 * engine.DeltaTime()));
}

engine.AttachToCanvas("gameArea");
engine.Renderer.Canvas.addEventListener("mousemove", function(e) { 
    var cRect = engine.Renderer.Canvas.getBoundingClientRect();
    var canvasX = Math.round(e.clientX - cRect.left);
    var canvasY = Math.round(e.clientY - cRect.top);
    mousePosition = { x: canvasX, y: canvasY };
});

engine.Start();