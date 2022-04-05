import { floatingMessages, floatingMessage } from './FloatingMessage.js';
import {cellSize , cellGap , varUtils } from './Utils.js'

export const enemies = [];
export const enemyPostition = [];
const enemyTypes = [];
const enemy1 = new Image();
enemy1.src = 'spritesheets\\enemy1.png';
enemyTypes.push(enemy1);
const enemy2 = new Image();
enemy2.src = 'spritesheets\\enemy2.png';
enemyTypes.push(enemy2);
let enemyCount = 0;

export class Enemy{
    constructor(verticalPosition , canvas){
        this.x = canvas.width;
        this.y = verticalPosition;
        this.width = cellSize - cellGap * 2;
        this.height = cellSize - cellGap * 2;
        this.speed = Math.random() * 0.2 + 0.4;
        this.movement = this.speed;
        this.health = 100;
        this.maxHealth = this.health;
        this.enemyType = enemyTypes[Math.floor(Math.random() * enemyTypes.length)];
        this.frameX = 0;
        this.frameY= 0;
        this.minFrame = 0;
        if(this.enemyType === enemy1) this.maxFrame = 4;
        else if(this.enemyType === enemy2)this.maxFrame = 7; 
        this.spriteWidth = 256;
        this.spriteHeight = 256;
    }
    update() {
        this.x -= this.movement;
        if(varUtils[2] % 9 === 0){
            if(this.frameX < this.maxFrame) this.frameX++;
            else this.frameX = this.minFrame;
        }      
    }
    draw(ctx){
        //ctx.fillStyle = 'Red';
        //ctx.fillRect(this.x , this.y , this.width , this.height)
        ctx.fillStyle = 'Black'
        ctx.font = "30px Orbitron";
        ctx.fillText(Math.floor(this.health) , this.x + 15 , this.y + 30)
        // ctx.drawImage(img , sx , sy , sw , sh ,dx , dy , dw , dh );
        ctx.drawImage(this.enemyType , this.frameX*this.spriteWidth ,
            0 , this.spriteWidth , this.spriteHeight , this.x , 
            this.y , this.width , this.height)
    }
}

export  function handleEnemies(canvas , ctx) {
    for (let i = 0; i < enemies.length; i++) {
        const element = enemies[i];
        element.update();
        element.draw(ctx); 
        if(element.x <= 0 ) varUtils[4] = true;    
        if(element.health<=0) {
            let gainedResources = enemies[i].maxHealth / 10;
            varUtils[0] += gainedResources;
            varUtils[3] += gainedResources;
            floatingMessages.push(new floatingMessage("+"+ gainedResources , enemies[i].x , enemies[i].y , 30 , 'purple'))
            floatingMessages.push(new floatingMessage("+"+gainedResources , 470 , 85 , 30 , 'gold'))
            let findThisIndex = enemyPostition.indexOf(element.y)
            enemyPostition.splice(findThisIndex , 1);
            enemies.splice(i , 1);
            i--;

        }
    }
    if(varUtils[2] % varUtils[1] === 0){
        if(enemyCount > 45) return;
        let verticalPosition = Math.floor(Math.random() * 7+2) * (cellSize) + cellGap;
        enemies.push(new Enemy(verticalPosition , canvas))
        enemyCount++;
        enemyPostition.push(verticalPosition);
        if(varUtils[1] > 120) varUtils[1] -=50;
    }
}