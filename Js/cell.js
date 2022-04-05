import {cellSize , mouse , collision } from './Utils.js'

export class Cell{
    constructor(x , y){
        this.x = x;
        this.y = y;
        this.height = cellSize;
        this.width = cellSize;
    }
    draw(ctx){

        if(mouse.x && mouse.y && collision(this , mouse)){
            ctx.strokeStyle = 'gold';
            ctx.strokeRect(this.x , this.y , this.width , this.height);
        }      
    }
}