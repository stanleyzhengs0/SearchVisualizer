import { anitmateBlockedPath } from '@/lib/Animations/a_star_animation';
import Heap from 'heap';



//adjust c value, accordingly
const c = 1000;

//break ties in favor of cells with smaller g-values, you can modify the priority function accordingly. 
//In this case, you can use the following priority function:
//Priority=c × ( f(s) − g(s) )


//break ties in favor of cells with Bigger g-values, you can modify the priority function accordingly. 
//In this case, you can use the following priority function:
//Priority=c × f(s) − g(s)
function customPriorityComparator(node1, node2) {
    const priority1 = c * (node1.f_cost - node1.g_cost);
    const priority2 = c * (node2.f_cost - node2.g_cost);

    return priority1 - priority2;
}

var openList = new Heap(customPriorityComparator);
var closedList = []; 
var visitedBlocks = []; 
var visitedNodes = []; 
var reconstructedPath = [];


//startnode = gridworld finish  ------ finishnode = gridworld start
export function backwards_a_star(grid, startNode, finishnode){

    startNode.isStart = true; 
    startNode.isFinish = false;

    finishnode.isFinish = true;
    finishnode.isStart = false;

    let agentsGrid = grid;
    let expansions = 0; 
    let new_finish = finishnode; 
    
    let partialPath = []
   
    let reconstructedPath = []
    let counter = 0
        while(counter < 2){
            expansions += 1; 
            
            startNode.g_cost = 0;
            startNode.searches = expansions;
            new_finish.g_cost = Infinity;
            new_finish.searches = expansions;
            console.log(grid, "be POINT")
            //pointer to node before a wall or the finishnode : from the gridworld finish to start 
            var stoppingPoint = a_star(agentsGrid, startNode, new_finish, expansions, visitedBlocks);
            console.log(stoppingPoint, "STOPPING POINT")
            console.log(startNode, "STARTING POINT")
            console.log(new_finish, "FINSIHED POINT")
            //traverse the pointer and create a list, that represents the path from agent to stopping point

            //returns a path list that starts from gridworld start to griworld finish
            var optimalPath = getOptimalPath(stoppingPoint)
            

            console.log(optimalPath, "OPTIMAL PATH")
            if(openList.empty()){ break; }

            //if we move the agent along the optimal path and it hits a wall restart search
            //new_start = a change in the grid world start ie INSTANCE FINISHNODE
            //partial path returns gridworld start to a new start for instance finish to discover
            partialPath = agentPath(optimalPath, startNode)

             //rebuild path
             reconstructedPath.push(...partialPath);



            if(!isAgentAtWall(optimalPath)){
                console.log(visitedNodes.length,"Number of Expansions:"); 
                return getShortestPathBackward(finishnode)
            }else{
                console.log("reset")

                new_finish = partialPath[partialPath.length-1];

                openList.toArray()
                openList.clear()
     
                resetClosedList(closedList);
                resetAllNodes(agentsGrid,new_finish);
            }

           

            console.log(startNode, "START NODE", new_finish, "NEW FINISH NODE", finishnode, "OLD FINISH")
           

           //nitmateBlockedPath(move);
           
          

            console.log(new_finish, "FINISHED AFTER REST")
            console.log(reconstructedPath, "REBULD")
            
            
            
           // if(stoppingPoint == finishnode){ console.log(visitedNodes.length,"Number of Expansions:"); break; }

            //if node is a wall, reset the closed and openlist
            //traverse the found path and add any neigboring blocks
            // if(path[path.length - 1].isWall){
            //     visitedBlocks.push(path[path.length - 1]);

                
            //     anitmateBlockedPath(path);

             
            // }

            counter +=1; 
        }
        return reconstructedPath;
 }

//compute path till, agent hits a wall or hits the goal state
export function a_star(grid, startNode, finishNode, expansions, visitedBlocks){

    console.log(startNode, "START NODE", finishNode, "NEW FINISH NODE")
  
    openList.push(startNode);
 
    //while the goal state g has not been seen and set
    while(startNode != finishNode){

        
        if(openList.empty()){return;}
        
        let currentNode = openList.pop();

        if(closedList.includes(currentNode) || visitedBlocks.includes(currentNode)){ continue; }
        if(currentNode == finishNode){ return finishNode; }
        // if(currentNode.isWall){continue;}
        
        
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
                neighbors[i].h_cost = heuristic(neighbors[i], finishNode);
                neighbors[i].f_cost = neighbors[i].g_cost + neighbors[i].h_cost;

                openList.push(neighbors[i]);
                visitedNodes.push(neighbors[i]);
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
    //while loop breaks, then goal state g has been set
    return [];
}
export function getShortestPathBackward(finishNode) {

const shortestPath = [];
let currentNode = finishNode;
while (currentNode !== null) {
    
    shortestPath.unshift(currentNode);
    currentNode = currentNode.previousNode;
}
return shortestPath;
}

export function getOptimalPath(finishNode) {

    const shortestPath = [];
    let currentNode = finishNode;
    while (currentNode !== null) {
        
        shortestPath.push(currentNode);
        currentNode = currentNode.previousNode;
    }
    return shortestPath;
    }

function foundPath(endofPath){
const path = [];
let currentNode = endofPath;
while (currentNode !== null) {
path.unshift(currentNode);

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

export function heuristic(node1, node2){

//manhattan distance from one neigbor node to the end node
var d1 = Math.abs (node1.row - node2.row);
var d2 = Math.abs (node1.col - node2.col);
return d1 + d2;
}

function resetAllNodes(grid, newStart){
for (const row of grid) {
    for (const node of row) {
        if(node == newStart){
        node.isFinish =true;
        }else{
        node.isFinish =false;
        }
        node.f_cost = 0;
        node.g_cost = Infinity;   
        node.h_cost = 0; 
        node.previousNode = null;
        node.searches = 0,
        
        console.log(node, "grid NODE")
    }
    }
}

function agentPath(path, finishNode) {

    path[0].isFinish = false; 
    const partialPath = []; 

    for(var i = 0; i < path.length; i++){
        console.log(path[i])

        if(path[i].isWall){
            console.log("HITWALLLLL")

            visitedBlocks.push(path[i-1])
            //move the agent up the path till the wall
            //set the new finishState as the node before the wall
            path[i-1].isFinish = true; 
            
            
            return partialPath
        }else{
            partialPath.push(path[i])

            if(path[i] == finishNode){
                return []
            }
        }
    }

    return ""
}
function isAgentAtWall(path){
    for(var i = 0; i < path.length; i++){

        if(path[i].isWall){
            return true; 
        }
    }
    return false; 
}   

function resetClosedList(closedList) {
    closedList.splice(0, closedList.length);
}