
export function a_star(grid, startNode, finishNode){
    var openList = [];
    openList.push(startNode);
    const closedList = [];
    const nodesToAnimate = [];

    while(openList.length > 0 ){
        
        var minCostIndex = 0; 

        for(var i = 0; i < openList.length; i++){
            if(openList[i].f_cost < openList[minCostIndex].f_cost){
                minCostIndex = i;
            }
        }

        const currentNode = openList[minCostIndex];
        nodesToAnimate.push(currentNode);

        //check if this minCostNode is the final node---
        if(currentNode == finishNode){
            return nodesToAnimate;
        }


        if(currentNode.isWall) continue; 

        closedList.push(currentNode);
        openList.splice(minCostIndex,1);
        
        //get the neighbors of the current node
        var neighbors = getNeighborNodes(currentNode, grid);

        for( var i = 0; i < neighbors.length; i++){
            
            if(closedList.includes(neighbors[i]) || neighbors[i].isWall) continue;

            var minNode = false; 
            const gCost = currentNode.g_cost + 1; 

            if(!openList.includes(neighbors[i]) ){
                minNode = true; 
                neighbors[i].h_cost = heuristic(neighbors[i], finishNode);
                openList.push(neighbors[i]);
                
            }else if(gCost < neighbors[i].g_cost){
                minNode = true;
            }

            if(minNode){
                neighbors[i].previousNode = currentNode;
                neighbors[i].g_cost = gCost;
                neighbors[i].f_cost = neighbors[i].h_cost + neighbors[i].g_cost;
                nodesToAnimate.push(neighbors[i]);
            }
            //check closed list and if its a better n
        
        }
    }

    return nodesToAnimate;
    
}

export function getShortestPath(finishNode) {
    const nodesInShortestPathOrder = [];
    let currentNode = finishNode;
    while (currentNode !== null) {
      nodesInShortestPathOrder.unshift(currentNode);
      currentNode = currentNode.previousNode;
    }
    return nodesInShortestPathOrder;
  }

function getNeighborNodes(currentNode, grid){
    const neighbors = [];
    const{row, col} = currentNode;2
    if (row < grid.length - 1) neighbors.push(grid[currentNode.row + 1][currentNode.col]);
    if (row > 0) neighbors.push(grid[currentNode.row - 1][currentNode.col]);
    if (col < grid[0].length - 1) neighbors.push(grid[currentNode.row][currentNode.col + 1]);
    if (col > 0) neighbors.push(grid[currentNode.row][currentNode.col - 1]);

    return neighbors;
}




export function heuristic(node1, node2){
    //manhattan distance from one neigbor node to the end node
    var d1 = Math.abs (node1.row - node2.row);
    var d2 = Math.abs (node1.col - node2.col);
    return d1 + d2;
}
