import Heap from 'heap';

//adjust c value, accordingly
const c = 100 ;

//break ties in favor of cells with smaller g-values, you can modify the priority function accordingly. 
//In this case, you can use the following priority function:
//Priority=c × ( f(s) − g(s) )


//break ties in favor of cells with Bigger g-values, you can modify the priority function accordingly. 
//In this case, you can use the following priority function:
//Priority=c × f(s) − g(s)
function customPriorityComparator(node1, node2) {
    const priority1 = c * node1.f_cost - node1.g_cost;
    const priority2 = c * node2.f_cost - node2.g_cost;

    return priority1 - priority2;
}

var openList = new Heap(customPriorityComparator);
var closedList = []; 
var visitedBlocks = []; 
var visitedNodes = []; 
var rebuildPath = [];

export function repeated_a_star(grid, startNode, finishnode){
    let agentsGrid = grid;
    let expansions = 0; 
    let new_start = startNode; 

        while(startNode != finishnode){
            expansions += 1; 
            new_start.g_cost = 0;
            new_start.searches = expansions;
            finishnode.g_cost = Infinity;
            finishnode.searches = expansions;
            //returns a path(AS A LIST) to a wall or the goal state   
            var path = a_star(agentsGrid, new_start, finishnode, expansions, visitedBlocks);
                             
            if(openList.empty()){ 
                console.log("NO PATH")
                return []
            }
            
            if(path == finishnode){ console.log(
                visitedNodes.length,"Number of Expansions:"); 
                //console.log(getShortestPath(path), "shortest")
                rebuildPath.push(getShortestPath(path))
                break; 
            }
            rebuildPath.push(path);

            //if node is a wall, reset the closed and openlist
            //traverse the found path and add any neigboring blocks
            if(path[path.length - 1].isWall){
                visitedBlocks.push(path[path.length - 1]);

                openList.toArray()
                openList.clear()
     
                resetClosedList(closedList);

                new_start = path[path.length - 2];

                resetAllNodes(agentsGrid,new_start);
            }
        }

        //console.log(rebuildPath, "REBUILT PATH")
        const recontructedPath = Array.from(new Set(rebuildPath.flat()));

        let wallFreePath = recontructedPath.filter(obj => !obj.isWall);
        //console.log(recontructedPath, "recontructedPath PATH")
        return wallFreePath;
 }

//compute path till, agent hits a wall or hits the goal state
export function a_star(grid, startNode, finishNode, expansions, visitedBlocks){
  
    openList.push(startNode);

    
    const top = openList.peek(); 

    //while the goal state g has not been seen and set
    while(finishNode.g_cost > top.f_cost){
        if(openList.empty()){return;}
        
        let currentNode = openList.pop();

        if(closedList.includes(currentNode) || visitedBlocks.includes(currentNode)){ continue; }
        if(currentNode == finishNode){ return finishNode; }
        if(currentNode.isWall){ return foundPath(currentNode, grid); }
        
        closedList.push(currentNode);
    
        const neighbors = getNeighborNodes(currentNode, grid); 
        for(var i = 0; i < neighbors.length; i++){
            //if the node is in the closed list or visited block ignore it
            if(closedList.includes(neighbors[i]) || visitedBlocks.includes(neighbors[i])){continue;}
            const isInOpenList = openList.toArray().find(node =>
                customPriorityComparator(node, neighbors[i]) === 0
              );
            //if the node hasnt been visited,
            if(neighbors[i].searches < expansions){
                neighbors[i].g_cost = Infinity;
                neighbors[i].searches = expansions; 
            }
            const gScore = currentNode.g_cost + 1; 
            //unvistied nodes, values are set
            if(neighbors[i].g_cost > gScore){
                neighbors[i].g_cost = gScore;
                neighbors[i].previousNode = currentNode; 
                neighbors[i].f_cost = neighbors[i].g_cost + neighbors[i].h_cost;

                openList.push(neighbors[i]);
                if(!neighbors[i].isWall){
                    visitedNodes.push(neighbors[i]);
                }
                
                expansions += 1;

                if(isInOpenList){
                    isInOpenList.g_cost = neighbors[i].g_cost;
                    isInOpenList.h_cost = neighbors[i].h_cost; 
                    isInOpenList.f_cost = neighbors[i].f_cost;
                    isInOpenList.previousNode = neighbors[i].previousNode
                }
            }      
        }
    }

    return [];
}

export function getShortestPath(finishNode) {

const shortestPath = [];
let currentNode = finishNode;
while (currentNode !== null) {   
    shortestPath.unshift(currentNode);
    currentNode = currentNode.previousNode;
}
return shortestPath;
}

function foundPath(endofPath, grid){
    const path = [];
    let currentNode = endofPath;

    while (currentNode !== null) {
    path.unshift(currentNode);
    
    if(!currentNode.isWall){
        const neighbors = getNeighborNodes(currentNode, grid)
        for(var i = 0; i < neighbors.length; i++){
            if(neighbors[i].isWall){
                visitedBlocks.push(neighbors[i])
            }
        }
    }
    currentNode = currentNode.previousNode;
    }
    return path;
}

export function visitedNodez(){
return visitedNodes
}

function getNeighborNodes(currentNode, grid){
const neighbors = [];
const{row, col} = currentNode;
if (row < grid.length - 1) neighbors.push(grid[currentNode.row + 1][currentNode.col]);
if (row > 0) neighbors.push(grid[currentNode.row - 1][currentNode.col]);
if (col < grid[0].length - 1) neighbors.push(grid[currentNode.row][currentNode.col + 1]);
if (col > 0) neighbors.push(grid[currentNode.row][currentNode.col - 1]);

return neighbors;
}

function resetAllNodes(grid, newStart){
    var row = 0;

    while (row < grid.length) {
        var col = 0;
    
        while (col < grid[row].length) {
            const node = grid[row][col]
            if(node == newStart){
                node.isStart =true;
            }else{
                node.isStart =false;
            }
            node.f_cost = 0;
            node.g_cost = Infinity;   
            node.previousNode = null;
            node.searches = 0,
            // Move to the next column
            col++;
        }
    
        // Move to the next row
        row++;
    }
}

function resetClosedList(closedList) {
closedList.splice(0, closedList.length);
}
