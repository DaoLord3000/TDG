import {Cell} from './cell.js';

export const cellSize = 49;
export const cellGap = 3;
let numberOfResources = 3000;
let enemyInterval = 600;
let frame  = 0;
let score = 0;
let gameOver = false;
let winningScore = 500;
let chosenDefender = 1;
let baseLevel = 1;
export const gameGrid = [];
export const gameObjects = {};
export const varUtils = [numberOfResources , enemyInterval , frame  ,score , gameOver , winningScore , chosenDefender , baseLevel];

//mouse
export let mouse = {
    x: 1,
    y: 1,
    width:0.1,
    height:0.1,
    clicked: false
}
//Collision Detection
export function collision(first , second){
    if( !(first.x > second.x + second.width ||
        first.x + first.width < second.x||
        first.y > second.y + second.height ||
        first.y + first.height < second.y)){
            
            return true;
        }
}
//Game Board Functions
export function createGrid(canvas){
    for (let y = 0; y < canvas.height; y+= cellSize) {
        for (let x = 0; x < canvas.width; x+= cellSize) {
            gameGrid.push(new Cell(x , y))  
        }
        
    }
}

export function handleGameGrid(ctx){
    for (let i = 0; i < gameGrid.length; i++) {
        gameGrid[i].draw(ctx);
        
    }
}
