//-----------------Engine Variables-----------------//
const EntityEngine = {
    canvas: undefined,
    renderer: undefined,
    engineExecutionEnabled: true,
    gameObject: [],
    sprites: [],
    FixedUpdateTimer: undefined,
    timer: undefined,
    AnimationTimer: undefined,
    isCustomRenderEnabled: true,
    spriteSheet: {
        spriteSheetSource: "./spriteSheet.png",
        tileSize: 25,
        height: 0,
        width: 0, 
        img: undefined
    },
    //
    fixedUpdateSpeed: 15,
    animationLoopSpeed: 700,
    targetFrameRate: 60,
};
//
const EntityGraphics = {
    deltaTime: function (timeStamp) {
        let deltaTime = timeStamp - EntityGraphics.lastExecution;
        return deltaTime;
    },
    lastExecution: 0,
};
//
const EnginePerformance = {
    performanceRenderingAverage : 0,
    executionCount: 0,
    operationStart: 0,
    operationEnd: 0,
    EnginePerformanceDisplayEnabled: false,
    startTimer: function() {
        EnginePerformance.operationStart = performance.now();
    },
    endTimer: function () {
        EnginePerformance.operationEnd = performance.now();
        let runTime = (EnginePerformance.operationEnd - EnginePerformance.operationStart);
        EnginePerformance.executionCount++;
        EnginePerformance.performanceRenderingAverage += runTime;
        let displayPerformance = ("Current operation speed:  " + (runTime) + " ms.\n Average operation speed: " + (EnginePerformance.performanceRenderingAverage / EnginePerformance.executionCount).toFixed(2) + " ms.\n Executions / second: " + (1000 / runTime).toFixed(2));
        EntityEngine.renderer.font = '7px Arial';
        EntityEngine.renderer.fillStyle = 'white';
        EntityEngine.renderer.fillText(displayPerformance, (0), (EntityEngine.canvas.height - (EntityEngine.renderer.measureText('M').width * 6)));
    },
};
//
var playerData = { 
    x: 225,
    y: 375,
    width: EntityEngine.spriteSheet.tileSize, 
    height: EntityEngine.spriteSheet.tileSize, 
    step: 25, 
    lives: 3, 
    remainingLives: 3, 
    spriteTag: "player",
    spriteIndex: 14,
};
//


// Use this for initialization
EntityEngine.InitializeEntityEngine = function() {
    EntityEngine.canvas = document.getElementById("gameArea");
    EntityEngine.renderer = EntityEngine.canvas.getContext("2d");
    // Loads in graphics
    EntityGraphics.InitializeGraphicsEngine();
    // Loads in set variables from the script.js file
    Initialize();
    // Sets timers for AnimationLoop
    EntityEngine.AnimationTimer = window.setInterval(EntityEngine.AnimationLoop, EntityEngine.animationLoopSpeed);
    // Start core engine loop
    EntityEngine.CoreUpdateLoop();
}
// Core update loop for calculations done every frame
// This loop is non-regulated! All calculations done here will be executed in a non-guaranteed timeframe.
// Execution times are heavily dependent on performance and their execution intervals is not fixed.
EntityEngine.CoreUpdateLoop = function(timeStamp) {
    if (EntityEngine.engineExecutionEnabled == true) {
        if (EntityGraphics.deltaTime(timeStamp) >= (1000 / EntityEngine.targetFrameRate))
        {
            Update();
            EntityGraphics.lastExecution = timeStamp;
        }
        EntityGraphics.Render();
    }
    window.requestAnimationFrame(EntityEngine.CoreUpdateLoop); 
}
// Core animation loop. Cycles through animated sprites every specified miliseconds and bumps their ID up by one.
EntityEngine.AnimationLoop = function () {
    EntityEngine.gameObject.forEach(element => {
        let objSpriteTag = element.sprite.name;
        EntityEngine.sprites.forEach(spriteElement => {
            if (spriteElement.isAnimated == true)
            {
                if (spriteElement.objTag == objSpriteTag) {
                    element.sprite.index += 1;
                    if (element.sprite.index == spriteElement.list.length) {
                        element.sprite.index = 0;
                    }
                    return;
                }
            }
        });
    });
}
EntityEngine.FindGameObject = function (objLookUpName) {
    let ID = 0;
    let index = 0;
    for (const element of EntityEngine.gameObject) {
        if (element.objName == objLookUpName) {
            ID = index;
            break;
        }
        index++;
    }
    return ID;
}
EntityEngine.CreateGameObject = function (x, y, width, height, tag, sprite, objName) {
    EntityEngine.gameObject.push({
        x: x,
        y: y,
        width: width,
        height: height,
        tag: tag,
        sprite: {
            name: sprite,
            index: 0
        },
        objName: objName
    });
}
EntityEngine.CreateSpriteMap = function (spriteObj) {
    EntityEngine.sprites.push(spriteObj);
}
EntityEngine.Collision = function (object) {
    let collision = false;
    let collisionObjects = [];
    for (const element of EntityEngine.gameObject) {
        if (element.x < object.x + object.width && element.x + element.width > object.x && element.y < object.y + object.height && element.y + element.height > object.y) {
            collisionObjects.push(element);
        }
    }
    //
    return {
        gameObjects: collisionObjects
    }
}
EntityEngine.TranslateObj = function (translateX, translateY, objID) {
    let object = EntityEngine.FindGameObject(objID);
    EntityEngine.gameObject[object].x += translateX;
    EntityEngine.gameObject[object].y += translateY;
}
EntityEngine.WaitForSeconds = function (ms) {
    // Halts engine execution for a specified amount of miliseconds
    const startTime = Date.now();
    let currentTime = null;
    do { currentTime = Date.now(); } while (currentTime - startTime < ms);
}
EntityEngine.CollisionBound = function (Obj) {
    // Checks for collisions against canvas bounds. Returns false on collision
    let isAtBound = false;
    switch(true) {
        case (Obj.y > (EntityEngine.canvas.height - EntityEngine.spriteSheet.tileSize)):
            isAtBound = true;
            break;
        case (Obj.y < 0):
            isAtBound = true;
            break;
        case (Obj.x > (EntityEngine.canvas.width - EntityEngine.spriteSheet.tileSize)):
            isAtBound = true;
            break;
        case (Obj.x < 0):
            isAtBound = true;
            break;
    }
    //
    for (const element of EntityEngine.gameObject) {
        if (element.tag == "EntityEngine_Boundary") {
            //Obj.x, I hate you.
            if ((element.x < Obj.x + Obj.width) && (element.x + element.width > Obj.x) && (element.y < Obj.y + Obj.height) && (element.y + element.height > Obj.y)) {
                isAtBound = true;
            }
        }
    }
    //
    return isAtBound;
}
//--------------------------------------------------------------------
EntityGraphics.InitializeGraphicsEngine = function () {
    EntityEngine.spriteSheet.img = new Image();
    EntityEngine.spriteSheet.img.src = EntityEngine.spriteSheet.spriteSheetSource;
    //
    EntityEngine.spriteSheet.img.onload = function () {
        EntityEngine.spriteSheet.height = this.height;
        EntityEngine.spriteSheet.width = this.width;
    }
    //
    EntityEngine.renderer.drawImage(EntityEngine.spriteSheet.img, 0, 0);
}
EntityGraphics.SpriteSheetIndexer = function (indexNum) {
    let indexWidth = EntityEngine.spriteSheet.width / EntityEngine.spriteSheet.tileSize;
    let rowNumber = Math.ceil(indexNum / indexWidth) - 1;
    let columnNumber = (indexNum - ((rowNumber) * (indexWidth))) - 1;
    //
    let returnIndex_row = (rowNumber * EntityEngine.spriteSheet.tileSize);
    let returnIndex_column = (columnNumber * EntityEngine.spriteSheet.tileSize);
    //
    return {
        rowIndex: returnIndex_row,
        columnIndex: returnIndex_column
    };
}
EntityGraphics.Render = function () {
    if (EntityEngine.engineExecutionEnabled == true) {
        EnginePerformance.startTimer();
        //
        EntityEngine.renderer.clearRect(0, 0, EntityEngine.canvas.width, EntityEngine.canvas.height);
        EntityEngine.gameObject.forEach(element => {
            let objectSpriteList = constructSpriteList(element);
            if (objectSpriteList.isMaterial == true) //render object as material
            {
                EntityEngine.renderer.beginPath();
                EntityEngine.renderer.rect(element.x, element.y, element.width, element.height);
                EntityEngine.renderer.fillStyle = objectSpriteList.sprites[0];
                EntityEngine.renderer.fill();
                EntityEngine.renderer.closePath();
            }
            else //render object as spritetile
            {
                let tsize = EntityEngine.spriteSheet.tileSize;
                objectSpriteList.sprites.forEach((spriteElement, index) => {
                    let spriteSheetLocation = EntityGraphics.SpriteSheetIndexer(parseInt(spriteElement));
                    for (let i = 0; i < (element.height / tsize); i++) {
                        EntityEngine.renderer.drawImage(EntityEngine.spriteSheet.img, spriteSheetLocation.columnIndex, spriteSheetLocation.rowIndex, tsize, tsize, element.x + ((index) * EntityEngine.spriteSheet.tileSize), element.y + (i * tsize), tsize, tsize);
                    }
                });
            }
        });
        //
        if (EntityEngine.isCustomRenderEnabled == true)
        {  
            try {
                RenderCustomData();
            }
            catch
            {
                EntityEngine.isCustomRenderEnabled = false;
            }
        }
        //
        EntityGraphics.RenderPlayer();
        // Creates a list of Indexes of the sprites making up the gameObject
        function constructSpriteList(obj) {
            let spriteCount = (obj.width / EntityEngine.spriteSheet.tileSize);
            let spriteList = [];
            let objTag = obj.sprite.name;
            let midCount = 0;
            let isMat = false;
            //
            EntityEngine.sprites.forEach(element => {
                if (element.objTag == objTag) {
                    if (element.isMaterial == true) // the sprite is a material
                    {
                        isMat = true;
                        spriteList.push(element.materialColor);
                        return;
                    }
                    else // the sprite is not a material
                    {
                        if (element.isAnimated == true) { // The sprite is animated
                            spriteList.push(element.list[obj.sprite.index]);
                            return;
                        }
                        else // The sprite is not animated
                        {
                            midCount = 0;
                            for (let i = 1; i <= spriteCount; i++) {
                                switch (i) {
                                    case 1:
                                        //gameObject start
                                        spriteList.push(element.start);
                                        break;
                                    case spriteCount:
                                        //gameObject end
                                        spriteList.push(element.end);
                                        break;
                                    default:
                                        //gameObject middle
                                        if (midCount < (element.middle.length)) {
                                            spriteList.push(element.middle[midCount]);
                                            midCount++;
                                        }
                                        if (midCount >= (element.middle.length)) {
                                            midCount = 0;
                                        }
                                        break;
                                }
                            }
                        }
                    }
                    return;
                }
            });
            return {
                sprites: spriteList,
                isMaterial: isMat
            };
        }
        //
        if (EntityEngine.EnginePerformanceDisplayEnabled == true) {
            EntityEngine.EnginePerformance.endTimer();
        }
    }
}
EntityGraphics.RenderPlayer = function () {
    let tsize = EntityEngine.spriteSheet.tileSize;
    let spriteSheetLocation = EntityGraphics.SpriteSheetIndexer(parseInt(playerData.spriteIndex));
    EntityEngine.renderer.drawImage(EntityEngine.spriteSheet.img, spriteSheetLocation.columnIndex, spriteSheetLocation.rowIndex, tsize, tsize, playerData.x, playerData.y, tsize, tsize);
}
