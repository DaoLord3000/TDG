import { cellSize , mouse , collision , varUtils } from "./Utils.js";
import { floatingMessages , floatingMessage } from "./FloatingMessage.js";

const resources = [];
const amounts = [20 ,30 , 40];
export class Resource{
    constructor(canvas){
        this.x = Math.random() * (canvas.width - cellSize);
        this.y = (Math.floor(Math.random()* 5) + 1) * cellSize + 25;
        this.height = cellSize * 0.6;
        this.width = cellSize * 0.6;
        this.amount = amounts[Math.floor(Math.random() * amounts.length)]
    }
    draw(ctx){
        ctx.fillStyle = 'yellow';
        ctx.fillRect(this.x , this.y , this.width , this.height);
        ctx.fillStyle = "black";
        ctx.font = "20px Orbitron";
        ctx.fillText(this.amount , this.x + 15 , this.y + 25)
    }
}

export function handleResources(ctx , canvas) {
    if(varUtils[2] % 500 === 0 && varUtils[3] < varUtils[5]){
        resources.push(new Resource(canvas))
    }    
    for (let i = 0; i < resources.length; i++) {
        resources[i].draw(ctx);
        if(resources[i] && mouse.x && mouse.y && collision(resources[i] , mouse)){
            varUtils[0]+= resources[i].amount;
            floatingMessages.push(new floatingMessage("+"+resources[i].amount , resources[i].x , resources[i].y , 40 , 'Black'));
            floatingMessages.push(new floatingMessage('+'+resources[i].amount , 470 , 80 , 40 , 'Gold'))
            resources.splice(i ,1);
            i--;
        }
        
    }
}