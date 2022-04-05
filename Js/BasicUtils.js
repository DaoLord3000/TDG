import { varUtils } from "./Utils.js";
import { enemies } from "./enemy.js";

export function handleGameStatus(ctx , varUtils){
    ctx.fillStyle = 'Gold';
    ctx.font = '30px Orbitron'
    ctx.fillText(" Score: " + varUtils[3] , 180 , 40)
    ctx.fillText(" Resources: " + varUtils[0] , 180 , 80);
    if(varUtils[4]){
        ctx.fillStyle = "Black";
        ctx.font = '90px Orbitron';
        ctx.fillText("GAME OVER" , 135 , 330)
    }
    if(varUtils[3] >= varUtils[5] && enemies.length === 0){
        ctx.fillStyle = "Black";
        ctx.font = '60px Orbitron';
        ctx.fillText("LEVEL COMPLETE" , 130 , 300);
        ctx.font = '30px Orbitron';
        ctx.fillText("You Win With " + varUtils[3] + " Points!" , 134 , 340);
    }
}
