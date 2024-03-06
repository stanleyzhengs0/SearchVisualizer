import { dijkstra, getNodesInShortestPathOrder } from "../Algorithms/dijkstra";

let START_NODE_ROW = 7;
let START_NODE_COL = 3;
const FINISH_NODE_ROW = 19;
const FINISH_NODE_COL = 19;


function animateDijkstra(visitedNodesInOrder: any[] | undefined  , nodesInShortestPathOrder: any) {
    if(!visitedNodesInOrder) return

    for (let i = 0; i <= visitedNodesInOrder.length; i++) {
      if (i === visitedNodesInOrder.length) {
        setTimeout(() => {
          animateShortestPath(nodesInShortestPathOrder);
        }, 5 * i);
        return;
      }
      setTimeout(() => {
        const node = visitedNodesInOrder[i];
        const element = document.getElementById(`node-${node.row}-${node.col}`);
        if(element){
          element.className ='node node-visited';
        }

      }, 5 * i);
    }
  }

  function animateShortestPath(nodesInShortestPathOrder: any[] ) {
    for (let i = 0; i < nodesInShortestPathOrder.length; i++) {
      setTimeout(() => {
        const node = nodesInShortestPathOrder[i];

        const element = document.getElementById(`node-${node.row}-${node.col}`);
        if(element){
          element.className = 'node node-shortest-path';
        }
      }, 20 * i);
    }
  }

 export function visualizeDijkstra(grid: any[][]) {
    // const {grid} = this.state;
    const startNode = grid[START_NODE_ROW][START_NODE_COL];
    const finishNode = grid[FINISH_NODE_ROW][FINISH_NODE_COL];
    const visitedNodesInOrder = dijkstra(grid, startNode, finishNode);
    const nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);
    animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder);
  }