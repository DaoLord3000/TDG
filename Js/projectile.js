import { collision,cellSize } from "./Utils.js";
import { projectiles } from "./defender.js";
import { enemies } from "./enemy.js";

export class Projectile{
    constructor(x , y){
       this.width = 10;
       this.height = 10;
       this.x = x;
       this.y = y;
       this.power = 20;
       this.speed = 5;

    }
    update(){
        this.x += this.speed;
    }
    draw(ctx){
        ctx.fillStyle = 'Black';
        ctx.beginPath();
        ctx.arc(this.x , this.y , this.width , 0 , Math.PI * 2);
        ctx.fill();
    }
}

export function handleProjectiles(ctx , canvas) {
    for (let i = 0; i < projectiles.length; i++) {
        projectiles[i].draw(ctx);
        projectiles[i].update();
        for (let j = 0; j < enemies.length; j++) {
            if(enemies[j] && projectiles[i] && collision(enemies[j] , projectiles[i])){
                enemies[j].health -= projectiles[i].power;
                projectiles.splice(i , 1);
                i--;
            }
            
        }
        if(projectiles[i] && projectiles[i].x > canvas.width - cellSize){
            projectiles.splice(i , 1);
            i--;
        }
    }
}