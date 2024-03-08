import { repeated_a_star,visitedNodez } from "../Algorithms/repeated_a_star";
import { adaptive_a_star, visitedAdaptive } from "../Algorithms/adaptive_a_star";
import { backwards_a_star, getShortestPathBackward } from "../Algorithms/backwards_a_star";

let START_NODE_ROW = 7;
let START_NODE_COL = 3;
const FINISH_NODE_ROW = 19;
const FINISH_NODE_COL = 19;


function animateAStar(visitedNodesInOrder: any[], shortestPath: any[]) {
    if(!visitedNodesInOrder) return

    if(shortestPath.length <= 1) return; 


    for (let i = 0; i <= visitedNodesInOrder.length; i++) {
      if (i === visitedNodesInOrder.length) {
        setTimeout(() => {
          animateShortestPath(shortestPath);
        },10 * i);
        return;
      }
      setTimeout(() => {
        const node = visitedNodesInOrder[i];
        const element = document.getElementById(`node-${node.row}-${node.col}`);
        if(element){
          element.className ='node node-visited';
        }

      }, 10 * i);
    }
  }

  export function animateShortestPath(nodesInShortestPathOrder: any[] ) {
    
    for (let i = 0; i < nodesInShortestPathOrder.length; i++) {
      setTimeout(() => {
        const node = nodesInShortestPathOrder[i];

        const element = document.getElementById(`node-${node.row}-${node.col}`);
        if(element){
          element.className = 'node node-shortest-path';
        }
      }, 7 * i);
    }
  }



 export async function visualizeAStar(grid: object[][]) {
    // const {grid} = this.state;
    const startNode = grid[START_NODE_ROW][START_NODE_COL];
    const finishNode = grid[FINISH_NODE_ROW][FINISH_NODE_COL];
    //const visitedNodesInOrder = a_star(grid, startNode, finishNode);
    const shortestPath = repeated_a_star(grid, startNode, finishNode);
    //const shortestPath = getShortestPath(finishNode);
    const visitedcells = visitedNodez();
    
    animateAStar(visitedcells,shortestPath);
  }

  export async function visualizeAdaptiveAStar(grid: object[][]) {
    // const {grid} = this.state;
    const startNode = grid[START_NODE_ROW][START_NODE_COL];
    const finishNode = grid[FINISH_NODE_ROW][FINISH_NODE_COL];
    //const visitedNodesInOrder = a_star(grid, startNode, finishNode);
    const shortestPath = adaptive_a_star(grid, startNode, finishNode);
    // const shortestPath = getShortestPath(finishNode);
    const visitedcells = visitedAdaptive();
    
    animateAStar(visitedcells,shortestPath);
  }

  export async function visualizeBackwardAStar(grid: object[][]) {
    // const {grid} = this.state;
    const finishNode = grid[START_NODE_ROW][START_NODE_COL];
    const startNode = grid[FINISH_NODE_ROW][FINISH_NODE_COL];
    //const visitedNodesInOrder = a_star(grid, startNode, finishNode);
    const visitedNodesInOrder = backwards_a_star(grid, startNode, finishNode);
    const shortestPath = getShortestPathBackward(finishNode);
    const visitedcells = visitedNodez();
    
    animateAStar(visitedNodesInOrder,shortestPath);
  }