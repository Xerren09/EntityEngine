
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
        // Get the vertex, whose orientation we want to check relative to the line 
        const testVertex = target.vertices[testVertexIndex];
        // Check vertex against self's every edge
        for(let selfVertexIndex = 0; selfVertexIndex < self.vertices.length; selfVertexIndex++)
        {
            const pointA_index = selfVertexIndex;
            // Wrap-around for the final edge
            const pointB_index = (selfVertexIndex+1 < self.vertices.length) ? (selfVertexIndex+1) : (0);
            const pointA = self.vertices[pointA_index];
            const pointB = self.vertices[pointB_index];
            // Check if testVertex is to the right of self's edge (counter-clockwise)
            if (isLeft(pointA, pointB, testVertex) == false)
            {
                // If false, we can ignore the rest of the edges, since this MUST be true to ALL edges
                isTestVertexInsideSelf = false;
                break;
            }
        }
        if (isTestVertexInsideSelf)
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
    if (first - second > 0)
    {
        return true;
    }
    else
    {
        return false;
    }
}