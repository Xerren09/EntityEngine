# EntityEngine
EntityEngine is a simple videogame engine written in javascript, designed to emulate old 8-bit style videogames (though it's not restricted to only that).

The goal of this project was to make an engine that can be used to replicate old cartridge games.

For an example, check out [Frogger](https://www.google.com "Frogger made in EntityEngine")!

## Simple example

This is just a simple documentation through an example. For a detailed one, see [EntityEngine Documentation](https://asd).

#### Adding a gameobject
```javascript
addGameObject(0, 0, 100, 25, "enemy", "matDemo", "obj1");
```
This will create the following object:
```javascript
[
  {
    objName: "obj1",
    width: 100,
    height: 25,
    sprite: [ "matDemo", 0 ],
    tag: "enemy",
    x: 0,
    y: 0
  }
],
```

`objName` is the unique name of the object.
The variables `x` and `y` contain the coordinates from the top left corner of the canvas element (0,0).
`width` and `height` are the width and height of the object (`width` counts from left to right, `height` counts from top to bottom).
`tag` is used by the collision and event systems to determine responses to touching the objects.
The `sprite` array always holds two values, a string, which is the name of the material associated with the object, and a number, which should be `0` by default.
In case the `sprite`'s string value points to an animated material, the number following the material's name denotes the index of the sprite in the animation sequence.

#### Adding a material

The engine currently supports three types of sprites:

```javascript
// Animated sprites
addSpriteTiles({ objTag: "animDemo", list: ["./default.png", "./default.png", "./default.png", "./default.png"], isMaterial: false, isAnimated: true});
// Regular material
addSpriteTiles({ objTag: "regDemo", start: "./default.png", middle: ["./default.png"], end: "./default.png", isMaterial: false, isAnimated: false});
// Regular single color material
addSpriteTiles({ objTag: "matDemo", materialColor: "#000080", isMaterial: true, isAnimated: false});
```

All of these contain an unique `objTag` which is used to reference sprites (in gameObject.sprite[0]).

In case of an animated material the `list:` variable should be added and filled with references to the sprites of the animation in order.
`isAnimated` should always be set to `true` in this case.

In case of a normal material the `start` variable contains the starting sprite (first sprite on the left), `end` contains the last sprite (last sprite, right end of object) and the `middle` contains the list of sprites between `start` and `end`.
`isAnimated` should always be set to `false` in this case, with along with `isMaterial`.

If a single color material is added, only the `materialColor` is required, in which case the value is the hexadecimal value of the desired color.
`isMaterial` should always be set to `true` in this case, with the rest set to `false`.

#### Moving an object on canvas

Moving objects can be done by calling the `TranslateObj` function:

```javascript
EntityEngine.TranslateObj(x, y, objName);
```

The function always takes 4 paramters:
`x` the amount of pixels to move on the x axis.
`y` the amount of pixels to move on the x axis.
`objName` takes the name of the object to be moved (looked up by EntityEngine.FindGameObject(objName) internally).

###### Example:
```javascript
EntityEngine.TranslateObj(1, 1, "obj1");
```

This would move the obj1 to the right by one pixel, and down by one pixel.
Calling this in the Update() function will make obj1 move smoothly down and to the right.
