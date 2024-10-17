
# EntityEngine

EntityEngine is a simple videogame engine written in ~~JavaScript~~ TypeScript, designed to emulate the style and feel of old 8-bit videogames in a modern way, through an HTML Canvas.


It has evolved quite a lot since the very first iterations (originally this was running in tables!) and has since been rewritten in TypeScript for better usability. The newer syntax is much more modern and tries to follow the easy to use and understand style other engines have created.


Huge thanks to my friend [Rachael Cowan](https://www.linkedin.com/in/rachael-cowan-41606522a/), for helping me with designing the rendering system [from the beginning](https://github.com/Xerren09/EntityEngine/blob/main/docs/RenderingPerformanceCaseStudy.md  "Read the case description here"), to the newest iteration with [compiled textures](https://github.com/Xerren09/EntityEngine/blob/main/lib/Sprites/TextureResource.ts). Without her help, the graphics system wouldn't be half as good.

*Note, that this is maintained as a fun little sideproject.*


## Engine

### Basics

Initiating the engine is done by creating a new instance and attaching it to a HTML Canvas element. This can be done with the constructor or via the `attachToCanvas` method later to move the game to a different canvas.

```javascript
const engine = new EntityEngine("gameArea");
```

There are 3 main events that provide the engine loop. They can be subscribed to via the standard JavaScript `addEventListener` method. Each listener will be run in order of registration.

##### Awake

Awake is called on start-up, and is meant to be used for initialisation. Create and load everything you need here!
```js
engine.addEventListener("awake", () => { });
```

##### Update

This function is called once per frame (60 times a second by default), and acts as the core update loop. Any gameplay logic should be executed here.

Listeners are passed an EngineTiming objects. Use this to access timing information for the current frame. This instance will be valid for the entire lifetime of the engine instance and will always provide the most up-to-date timing data, so feel free to use it wherever you want.

```js
engine.addEventListener("update", (timing) => { });
```

##### CustomRender

This is called after the internal rendering pass is completed. Can be used to draw up custom UI on top of the already rendered items.
This function had one parameter, the renderer (CanvasRenderingContext2D), which can be used directly to draw on the canvas.

```js
engine.addEventListener("customRender", (renderer) => { });
```

### Starting the engine

Calling `engine.Start()` starts the engine immediately, and calls the `awake` event.

### Pausing

There are several ways to stop the engine, either temporarily or permanently.

#### Wait()

Stops the engine for the specified amount of time (milliseconds).
```js
engine.Wait(1500);
```
This wait can be cancelled by calling `CancelWait()`.

#### Stop()

Stops the engine completely, and indefinitely (also calls `CancelWait()` in the background).

From this state, there are two ways to restart:
Either calling `Start()`, which immediately restarts execution like nothing happened,
or by calling `Reset()`, which completely resets the game to its default configuration, and then starts again.

### Performance

There are various performance stats that are available directly on the engine instance via the `Timing` property. This returns the same objects as:
```js
engine.addEventListener("update", (timing) => { });
```

#### lastFrameTime
Gets the total time the engine needed to execute the last frame in milliseconds.

#### isFrameTimeAllocationEnough
Gets whether the current target framerate is feasible. If often false, the engine does not have enough time execute game code and render the frame before its allocation is up.


## Entities

Entities are the basic elements of a game, representing game objects. They are used to represent everything from terrain, backgrounds, and obstacles, to items, interactables, enemies and player(s).

Creating and setting up a new entity is simple, and uses a familiar syntax to most modern videogame engines:

```javascript
let player = new Entity("player");
player.Size = { width: 100, height: 25 };
player.Position = { x: 25, y: 25 };
player.Sprite = new Sprite(["#FF00FF"], { width: 25, height: 25 });
player.Collider = new RectCollider(player.Size);
player.Tags.push("player");
```

`Size` and `Position` both default to 0 values unless manually set at the start. Generally, size should be cleanly divisible by the tile size of the attached sprite. Additinally, entities can be rotated (in degrees) via the `Rotation` property.

Tags are used to quickly find entities and group them together.

See [Sprites](#sprites) for more information about textures.
See [Colliders](#colliders) for more information about collisions and colliders.

To use an entity in a game, it needs to be registered with the engine instance:

```javascript
engine.Entities.Add(player);
```

In case the entity is no longer needed (e.g.: an enemy), it can be removed from the game:

```javascript
engine.Entities.Remove(player);
```

### Getting an entity

#### By ID

Searching for a specific enemy can be done by using its ID:
```javascript
let player: Entity = engine.Entities.Find("player");
```

#### By Tags

Searching by tags returns an array of entities that have the specific tag:

```javascript
let enemies: Entity[] = engine.Entities.FindAllTagged("enemy");
```
### Moving an entity

Moving entities can be done by either calling the `Translate` or `MoveTowards` method:

#### Translate
Moves an entity by the given vector.

```javascript
let player = engine.Entities.Find("player");
player.Translate({x: 1, y: 0});
```

In order to have a fixed stepsize, multiple the vector values by `engine.Timing`:

```javascript
player.Translate({x: 1 * engine.Timing.delta, y: 0});
```

#### MoveTowards

Moves an entity towards a given coordinate by the specified step size. Under the hood, this uses `Translate` for the actual movement.

```javascript
let player = engine.Entities.Find("player");
player.MoveTowards({x: 100, y: 100}, 10);
```

In order to have a fixed step size, multiple the step size by `engine.Timing.delta`;

## Textures

Sprites provide the visual elements of a game. They can be static or animated, single coloured or images from a Sprite sheet.

### Sprite Sheet

Sprite sheets provide detailed image support for sprites. They can be any type that the HTML Image API understands:

![Example of a sprite sheet](./docs/Images/spritesheet.png)

When creating a new sprite sheet, pass the file path/name of the image file, and the tile size in pixels (_this should be uniform for every sprite within a sheet_).
```javascript
let spriteSheet = new SpriteSheet("spritesheet.png", { width: 25, height: 25 });
```

The spritesheet can then be loaded via the `Load` method, or via the `spriteSheetLoader` function. It is important to load spritesheets _before_ the engine is started, for example like this:

```js
spriteSheetLoader(spriteSheet).then(() => {
    engine.start();
});
```
Upon loading, a built-in preprocessor will index the tiles, which are available in the `IndexMatrix` property (0 based indexing).

By default, spritesheets aren't meant to be interacted with manually, beside referencing them in other sprites.

### Sprite

Basic sprites provide static texture for entities. They can handle both hex-colours and sprite sheet indexes (at the same time). When using a spritesheet, the tile size of the sprite should match that of the spritesheet's (use `SpriteSheet.tileSize` to get it)
If a sprite only uses hex-colours, providing a sprite sheet is not necessary.
```javascript
const demoSprite = new Sprite(["#FF00FF"], { width: 25, height: 25 });
// OR
const demoSprite = new Sprite(["#FF00FF", 1, "#FF00FF"], { width: 25, height: 25 }, spriteSheet);
```
Sprites are rendered left to right, according to their tile size. A sprite's contents will wrap around and cycle until the entire entity is filled. The tile size will be taken from the referenced sprite sheet, if any, which will cause hex-colours to be drawn in identical sized segments too.

Once created, the underlying `TextureResource` will compile the sprite into a CanvasPattern that us then used during rendering, so changing the sprite after this is not possible.


### AnimatedSprite

Animated sprites, as the name implies, provide animated sprites, with the caveat of only a single "frame" being available at a time, which is repeated to fill the entire entity. Additionally, the animation speed (ms) is also required.

```javascript
const demoSprite = new AnimatedSprite(500, ["#FF00FF", "#00FF00"], { width: 25, height: 25 });
// OR
const demoSprite = new AnimatedSprite(500, [1, 2, 3, 4, 5], spriteSheet.tileSize, spriteSheet);
// OR
const demoSprite = new AnimatedSprite(500, [1, 2, "#FF00FF", 4, 5], spriteSheet.tileSize, spriteSheet);
```

Animated sprites will update every given millisecond, although there might be a slight delay due to how rendering works (update may be delayed by up to a frame's idle time). The `Value` property provides the current in-frame element, which dynamically updates.

## Colliders

Colliders allow entities to interact with each other. They can be freely reused between entities and will work. They can be assigned an offset, which will displace them from the center of entities when assigned.

Currently there are two kinds of colliders: Rect and Circle.

### RectCollider

```js
const rect = new RectCollider({ width: 10, height: 10});
// With offset
const rect = new RectCollider({ width: 10, height: 10}, { x: 10, y: 10});
```

### CircleCollider

```js
const circle = new CircleCollider(10);
// With offset
const circle = new CircleCollider(10, { x: 10, y: 10});
```

### Usage

To use a collider, assign to an entity via its `Collider` property. A collider can be assigned to multiple entities at the same time.

To test collisions, use the entity's `IsIntersecting` method and target a specific entity:

```js
if (player.IsIntersecting(block)) {
    console.log(`Collision with ${block.ID}`);
}
```

## Simple example

This is a simple demonstration of the engine, using the above sprite sheet as an example. The player entity will slowly move towards and follow the current cursor position above the canvas. A more comprehensive demo is available [here](https://github.com/Xerren09/EntityEngine/blob/main/demo.ts);

```js
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
let mousePosition = { x: 150, y: 150 };

const spriteSheet = new SpriteSheet("spritesheet.png", { width: 25, height: 25 });

engine.addEventListener("awake", () => {
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
    player = new Entity("player");
    player.Size = { width: 100, height: 25 };
    player.Sprite = demoSpliceSprite;
    player.Position = { x: 100, y: 100 };
    player.Collider = new RectCollider(player.Size);
    engine.Entities.Add(player);
    //
});

engine.addEventListener("update", (time) => {
    const step = (50 * time.delta);
    player.Position = mousePosition;
    if (player.IsIntersecting(block)) {
        console.log(`Collision with ${block.ID}`);
    }
});

engine.Renderer.canvas.addEventListener("mousemove", function (e) {
    var cRect = engine.Renderer.canvas.getBoundingClientRect();
    var canvasX = Math.round(e.clientX - cRect.left);
    var canvasY = Math.round(e.clientY - cRect.top);
    mousePosition = { x: canvasX, y: canvasY };
});

spriteSheetLoader(spriteSheet).then(() => {
    engine.start();
});

```