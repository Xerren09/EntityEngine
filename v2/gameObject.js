export const gameObjects = [];

export const gameObject = {
    find(objectName) {
        const obj = gameObjects.find(element => element.name == objectName);
        if (obj == undefined)
        {
            console.error(new Error(`gameObject.find : gameObject "${objectName}" does not exist. Declare the object first before accessing it.`));
            return undefined;
        }
        else
        {
            return {
                ...obj,
                get x () {
                    return gameObjects[this.props.id].x;
                },
                set x (x) {
                    gameObjects[this.props.id].x = x;
                },
                get y () {
                    return gameObjects[this.props.id].y;
                },
                set y (y) {
                    gameObjects[this.props.id].y = y;
                },
                translate,
                moveTowards,
                collision,
                get props () {return obj},
                /**
                 * (Read-Only)
                 */
                set props (x) {/* Block changing props */}
            };
        }
    },
    new(objectName, x, y, width, height, tag, spriteName) {
        if (gameObjects.findIndex(element => element.name === objectName) == -1)
        {
            gameObjects.push({
                x: x,
                y: y,
                get vertices () {
                    return [
                        {
                            x: this.x,
                            y: this.y
                        },
                        {
                            x: this.x+this.width,
                            y: this.y
                        },
                        {
                            x: this.x+this.width,
                            y: this.y+this.height
                        },
                        {
                            x: this.x,
                            y: this.y+this.height
                        },
                    ];
                },
                width: width,
                height: height,
                tag: tag,
                sprite: {
                    name: spriteName,
                    index: 0,
                    lastUpdate: 0
                },
                name: objectName, 
                id: gameObjects.length
            });
        }
        else
        {
            throw new Error(`gameObject.new : gameObject "${objectName}" already exists.`);
        }
    },
    destroy() {

    }
};

function translate(translateX=0, translateY=0) {
    gameObjects[this.id].x += translateX;
    gameObjects[this.id].y += translateY;
}

function moveTowards(targetObject, step) {
    const target = targetObject;
    const distanceVector = {
        x: target.x - this.x,
        y: target.y - this.y
    };
    const vectorLength = Math.sqrt(Math.pow(distanceVector.x, 2) + Math.pow(distanceVector.y, 2));
    const normalVector = {
        x: distanceVector.x / vectorLength,
        y: distanceVector.y / vectorLength,
    };
    gameObjects[this.id].x += normalVector.x * step;
    gameObjects[this.id].y += normalVector.y * step;
}

function rotate() {

}

function collision(tag) {
    const self = this.props;
    let collisionObjects = [];
    for (const target of gameObjects) {
        // Check only against objects with a specific tag (more optimal) OR against all objects (wasteful)
        if (target.tag === tag || tag === undefined)
        {
            // We need to check both self -> target, and target -> self
            // because in some cases (target is bigger than self) it's possible for vertices not be inside self or target
            if (isOverlapping(self, target) || isOverlapping(target, self)) // || isOverlapping(target, self)
            {
                collisionObjects.push(target);
            }
        }        
    }
    return collisionObjects;
}

/**
 * Runtime: for every ***n*** edge on `self`, ***m*** loops are required, where ***m*** is the number of vertices `target` has.
 * 
 * @param {object} self 
 * @param {object} target 
 * @returns {boolean}
 */
function isOverlapping(self, target) {
    let overlap = false;
    for(let testVertexIndex = 0; testVertexIndex < target.vertices.length; testVertexIndex++)
    {
        // Assume we have a collision
        let isTestVertexInsideSelf = true;
        let isTestEdgeIntersect = false;
        // Get the vertex, whose orientation we want to check relative to the line 
        const target_pointA_index = testVertexIndex;
        const target_pointA = target.vertices[target_pointA_index];
        const target_pointB_index = (testVertexIndex+1 < self.vertices.length) ? (testVertexIndex+1) : (0);
        const target_pointB = target.vertices[target_pointB_index];
        // Check vertex against self's every edge
        for(let selfVertexIndex = 0; selfVertexIndex < self.vertices.length; selfVertexIndex++)
        {
            const self_pointA_index = selfVertexIndex;
            // Wrap-around for the final edge
            const self_pointB_index = (selfVertexIndex+1 < self.vertices.length) ? (selfVertexIndex+1) : (0);
            const self_pointA = self.vertices[self_pointA_index];
            const self_pointB = self.vertices[self_pointB_index];
            // Check if testVertex is to the right of self's edge (counter-clockwise)
            const doEdgesIntersect = ((isLeft(self_pointA, self_pointB, target_pointB).edge != isLeft(self_pointA, self_pointB, target_pointA).edge) && (isLeft(target_pointA, target_pointB, self_pointA).edge != isLeft(target_pointA, target_pointB, self_pointB).edge));
            const isPointWithinSelf = isLeft(self_pointA, self_pointB, target_pointA).point;
            if (doEdgesIntersect)
            {
                // If true, we can ignore the rest of the edges, since one intersecting edge means collision
                isTestEdgeIntersect = true;
                break;
            }
            else if (isPointWithinSelf == false)
            {
                // If false, we can ignore the rest of the edges, since this MUST be true to ALL edges
                isTestVertexInsideSelf = false;
                break;
            }
        }
        if (isTestEdgeIntersect == true || isTestVertexInsideSelf == true)
        {
            // testVertex is inside self
            overlap = true;
            break;
        }
    }
    return overlap;
}

function isLeft(pointA, pointB, pointF) {
    const BAx = pointB.x - pointA.x;
    const FAy = pointF.y - pointA.y;
    const BAy = pointB.y - pointA.y;
    const FAx = pointF.x - pointA.x;
    //
    const first = BAx * FAy;
    const second = BAy * FAx;
    //
    return {
        edge: (first > second),
        point: (first - second > 0),
    };
}