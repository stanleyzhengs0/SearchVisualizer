'use client'
// import { getInitialGrid } from '@/lib/Grid/Grid';
import Node from '@/lib/Node/Node';
import React, { useState } from 'react'
import {dijkstra, getNodesInShortestPathOrder} from '../lib/Algorithms/dijkstra';
import { visualizeDijkstra } from '@/lib/Animations/dijkstra_animation';
import { visualizeAStar, visualizeAdaptiveAStar, visualizeBackwardAStar } from '@/lib/Animations/a_star_animation';




let START_NODE_ROW = 0;
let START_NODE_COL = 0;
const FINISH_NODE_ROW = 9;
const FINISH_NODE_COL = 9;


const PathVisualizer = () => {

  const[grid, setGrid] = useState(getInitialGrid());  

  const[mouseIsPressed, setMouseIsPressed] = useState(false);

  //console.log(grid);

  function handleMouseDown(row: any, col: any) {
    const newGrid = getNewGridWithWallToggled(grid, row, col);
    setMouseIsPressed(true);
    setGrid(newGrid)

  }

  function handleMouseEnter(row: any, col: any) {
    if (!mouseIsPressed) return;
    const newGrid = getNewGridWithWallToggled(grid, row, col);
    setGrid(newGrid)
  }

  function handleMouseUp() {
    setMouseIsPressed(false);
  }



  return (

    <>
    <div className='flex p-10 gap-10'>
     
        {/* <button onClick={() => visualizeDijkstra(grid)} className='border ' >
          Visualize Dijkstra's Algorithm
        </button>  */}
     
        <button onClick={() => visualizeAStar(grid)} className='border'>
            Visualize Repeated Foward A* 
        </button>

        <button onClick={() => visualizeBackwardAStar(grid)} className='border'>
            Visualize Backwards Foward A* 
        </button>


        <button onClick={() => visualizeAdaptiveAStar(grid)} className='border'>
            Visualize Adaptive A* 
        </button>
      

    </div>
      
    
      <div >
          {grid.map((row, rindex) => {
            return <div className='flex' key={rindex}>      
              {row.map((col: any, cindex: any) => 
                
                <Node
                key={cindex}
                {...col}
                onMouseDown = {(row: number, col: number) => handleMouseDown(row,col)}
                onMouseEnter = {(row: number, col: number) => handleMouseEnter(row,col)}
                onMouseUp = {() => handleMouseUp()}
                />
            
              )}
            </div>
          })}
      </div> 

      
    </>
    
  )
}

export const getInitialGrid = () => {
  const grid = [];
  for (let row = 0; row < 10; row++) {
    const currentRow = [];
    for (let col = 0; col < 10; col++) {

      const node = createNode(col,row)
      
      node.h_cost = heuristic(node, FINISH_NODE_ROW, FINISH_NODE_COL);
      // if((!node.isStart || !node.isFinish) && Math.random() < .3){
      //   node.isWall = true;
      // }
      currentRow.push(node);

    }
    grid.push(currentRow);
  }

  return grid;
};


function heuristic(node1: any, finish_node_row: number, finish_node_col:number){
  //manhattan distance from one neigbor node to the end node
  var d1 = Math.abs (node1.row - finish_node_row);
  var d2 = Math.abs (node1.col - finish_node_col);
  return d1 + d2;
  }
  


export const createNode = (col: number, row: number) => {
  return {
    col,
    row,
    isStart: row === START_NODE_ROW && col === START_NODE_COL,
    isFinish: row === FINISH_NODE_ROW && col === FINISH_NODE_COL,
    isWall: false,
    previousNode: null,
    isVisited: false,
    distance: Infinity,
    f_cost: 0, 
    g_cost: Infinity, 
    h_cost: 0,
    searches:0,
    expansions: 0
  };
};





const getNewGridWithWallToggled = (grid:any[][], row: number, col: number) => {
  const newGrid = grid.slice();
  const node = newGrid[row][col];
  const newNode = {
    ...node,
    isWall: true,
  };
  newGrid[row][col] = newNode;
  return newGrid;
};



export default PathVisualizer
