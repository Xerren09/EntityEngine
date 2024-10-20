import {
    EntityEngine,
    Entity, 
    AnimatedSprite,
    Sprite,
    RectCollider,
    CircleCollider,
    SpriteSheet,
    spriteSheetLoader
} from "./index.js"

const engine = new EntityEngine("gameArea");

let player: Entity;
let block: Entity;
let circle: Entity;
let mousePosition = { x: 150, y: 150 };

const spriteSheet = new SpriteSheet("spritesheet.png", { width: 25, height: 25 });

engine.addEventListener("awake", () => {
    console.log("awake event");
    //
    const demoSprite = new Sprite(["#FF00FF"], { width: 25, height: 25 });
    const demoSpliceSprite = new Sprite([1, 2, 3, 4, 5], spriteSheet.tileSize, spriteSheet);
    //
    block = new Entity("block");
    block.Size = { width: 150, height: 25 };
    block.Sprite = new AnimatedSprite(500, [1, 2, 3, 4, 5], spriteSheet.tileSize, spriteSheet);
    block.Position = { x: 300, y: 300 };
    block.Collider = new RectCollider(block.Size);
    block.Tags.push("block");
    engine.Entities.Add(block);
    //
    circle = new Entity("circle");
    circle.Size = { width: 100, height: 100 };
    circle.Sprite = demoSpliceSprite;
    circle.Position = { x: 100, y: 100 };
    circle.Collider = new CircleCollider(50);
    circle.Tags.push("circle");
    circle.Rotation = 45;
    engine.Entities.Add(circle);
    //
    player = new Entity("player");
    player.Size = { width: 100, height: 25 };
    player.Sprite = demoSpliceSprite;  //new AnimatedSprite(500, [1, 2, 3, 4, 5], spriteSheet); //new Sprite("testSpriteNormal", [1], "testSheet");
    player.Position = { x: 100, y: 100 };
    player.Collider = new RectCollider(player.Size);//new CircleCollider(player, 50);
    engine.Entities.Add(player);
    //
});

let timer = performance.now();

engine.addEventListener("update", (time) => {
    //console.log("update event");
    //
    timer = performance.now();
    const step = (50 * time.delta);
    player.Position = mousePosition;
    //player.MoveTowards(mousePosition, step);
    const rot = (15 * time.delta);
    player.Rotation += rot;
    player.Size.height += (10 * time.delta);
    //console.log(player.Collider.isOversecting(block));
    if (circle.IsIntersecting(player)) {
        console.log(`Collision with ${circle.ID}`);
    }
    if (player.IsIntersecting(block)) {
        console.log(`Collision with ${block.ID}`);
    }
    console.log(time.lastRenderTime);
});

engine.Renderer.options.drawColliders = true;
engine.Renderer.options.drawEntityBounds = true;
engine.Renderer.canvas.addEventListener("mousemove", function (e) {
    var cRect = engine.Renderer.canvas.getBoundingClientRect();
    var canvasX = Math.round(e.clientX - cRect.left);
    var canvasY = Math.round(e.clientY - cRect.top);
    mousePosition = { x: canvasX, y: canvasY };
});

spriteSheetLoader(spriteSheet).then(() => {
    engine.start();
});
