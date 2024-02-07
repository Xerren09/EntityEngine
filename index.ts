import { createEngine } from "./lib/Engine/Core.js";
import Entity from "./lib/Entities/Entity.js";
import AnimatedSprite from "./lib/Sprites/AnimatedSprite.js";
import { SpriteSheets } from "./lib/Sprites/SpriteSheets.js";
import SpriteSheet from "./lib/Sprites/SpriteSheet.js";
import { RectCollider } from "./lib/Entities/Collision/Colliders/Rectangle.js";
import Sprite from "./lib/Sprites/Sprite.js";
import { CircleCollider } from "./lib/Entities/Collision/Colliders/Circle.js";

const [
    engine,
    entities,
    spritesheets
] = createEngine("gameArea");

let player: Entity;
let block: Entity;
let circle: Entity;
let mousePosition = { x: 0, y: 0 };

engine.addEventListener("awake", () => {
    console.log("awake event");
});

engine.addEventListener("update", () => {
    console.log("update event");
});

engine.Awake = () => {
    let spriteSheet = new SpriteSheet("testSheet", "spritesheet.png", { width: 25, height: 25 });
    spriteSheet.Load();
    //
    block = new Entity("block");
    block.Size = { width: 150, height: 150 };
    block.Sprite = new Sprite("demo", ["#FF00FF"], block.Size);
    block.Position = { x: 300, y: 300 };
    block.Collider = new RectCollider( block.Size);
    block.Tags.push("block");
    entities.Register(block);
    //
    circle = new Entity("circle");
    circle.Size = { width: 100, height: 100 };
    circle.Sprite = new Sprite("demo", ["#FF00FF"], circle.Size);
    circle.Position = { x: 100, y: 100 };
    circle.Collider = new CircleCollider(50);
    circle.Tags.push("circle");
    circle.Rotation = 45;
    entities.Register(circle);
    //
    player = new Entity("player");
    SpriteSheets.Register(spriteSheet);
    player.Sprite = new AnimatedSprite("testSprite", 100, [1, 2, 3, 4, 5], "testSheet"); //new Sprite("testSpriteNormal", [1], "testSheet");
    player.Size = { width: 100, height: 25 };
    player.Position = { x: 150, y: 150 };
    player.Collider = new RectCollider(player.Size);//new CircleCollider(player, 50);
    entities.Register(player);
    //

};
let timer = performance.now();
engine.Update = () => {
    timer = performance.now();
    const delta = engine.DeltaTime();
    const step = (50 * delta);
    player.Position = mousePosition;
    //player.MoveTowards(mousePosition, step);
    const rot = (15 * delta);
    player.Rotation += rot;
    //console.log(player.Collider.isOversecting(block));
    if (circle.Collider.isOversecting(player)) {
        console.log(`Collision with ${circle.ID}`);
    }
    if (player.Collider.isOversecting(block)) {
        console.log(`Collision with ${block.ID}`);
    }
    //console.log(performance.now() - timer);
};
engine.AttachToCanvas("gameArea");
engine.Renderer.options.drawColliders = true;
engine.Renderer.options.drawEntityBounds = false;
engine.Renderer.Canvas.addEventListener("mousemove", function (e) {
    var cRect = engine.Renderer.Canvas.getBoundingClientRect();
    var canvasX = Math.round(e.clientX - cRect.left);
    var canvasY = Math.round(e.clientY - cRect.top);
    mousePosition = { x: canvasX, y: canvasY };
});
engine.Start();