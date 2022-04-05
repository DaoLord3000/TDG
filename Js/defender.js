import {cellSize , cellGap , varUtils  , collision , mouse} from './Utils.js'
import{enemyPostition , enemies} from './enemy.js'
import {Projectile} from './projectile.js'

export const defender1 = new Image();
defender1.src = 'spritesheets\\defender1.png'
export const defender2 = new Image();
defender2.src = 'spritesheets\\defender2.png'
export const barrackImage = new Image();
barrackImage.src = 'spritesheets\\barracks.png'
export const resourceCollectorImage = new Image();
resourceCollectorImage.src = 'spritesheets\\resourceCollector.png'

export const defenders = [];
export const projectiles = []
export const soldierCount = 4;

export class Defenders{
    constructor(x , y){
        this.x = x;
        this.y = y;
        this.width = cellSize - cellGap * 2;
        this.height = cellSize - cellGap * 2;
        this.shooting = false;
        this.shootNow = false;
        this.health = 100;
        this.projectiles = [];
        this.timer = 0; 
        this.frameX = 0;
        this.frameY = 0;
        this.spriteWidth = 194;
        this.spriteHeight = 194;
        this.minFrame = 0;
        this.maxFrame = 16;  
        this.chosenDefender = varUtils[6];
    }
    draw(ctx){
        //ctx.fillStyle = 'blue';
        //ctx.fillRect(this.x , this.y , this.width , this.height);
        ctx.fillStyle = 'Black';
        ctx.font = '30px Orbitron';
        ctx.fillText(Math.floor(this.health) , this.x + 15, this.y + 30)
        if(this.chosenDefender === 1){
            ctx.drawImage(defender1 , this.frameX * this.spriteWidth , 0 , this.spriteWidth , this.spriteHeight
                , this.x , this.y , this.width , this.height);
        }else if(this.chosenDefender === 2){
            ctx.drawImage(defender2 , this.frameX * this.spriteWidth , 0 , this.spriteWidth , this.spriteHeight
                , this.x , this.y , this.width , this.height);
        }  
    }
    update(){
        if(varUtils[2]%4 === 0){
            if(this.frameX < this.maxFrame) this.frameX++;
            else this.frameX = this.minFrame; 
            if(this.frameX === 15) this.shootNow = true;
        }
        if(this.chosenDefender === 1){
            if(this.shooting){
                this.minFrame = 0;
                this.maxFrame = 16;
            }
            else{
                this.minFrame = 17;
                this.maxFrame = 24;
            }
        }else if(this.chosenDefender === 2){
            if(this.shooting){
                this.minFrame = 13;
                this.maxFrame = 28;
            }
            else{
                this.minFrame = 0;
                this.maxFrame = 12;
            }
        }
        
        if(this.shooting && this.shootNow){
            projectiles.push(new Projectile(this.x + 90 , this.y + 40));
            console.log(projectiles)
            this.shootNow = false;
        }
    }
}

export function handleDefenders(ctx){
    for (let i = 0; i < defenders.length; i++) {
        defenders[i].draw(ctx);
        defenders[i].update();
        if(enemyPostition.indexOf(defenders[i].y) !== -1){
            defenders[i].shooting = true;
        }else defenders[i].shooting = false;
        for (let j = 0; j < enemies.length; j++) {
            let enemy = enemies[j];
            if(defenders[i] && collision(defenders[i] , enemy)){
                enemy.movement = 0;
                defenders[i].health -= 0.2
            }
            if(defenders[i] && defenders[i].health <=0 ){
                defenders.splice(i , 1);
                i--;
                enemy.movement = enemy.speed;
            }
            
        }
    }
}

export const card1 = {
    x: 10,
    y: 10,
    width: 70,
    height: 85,
    cardStyle: 'black',
    soldiers: soldierCount/2 
}
export const card2 = {
    x: 90,
    y: 10,
    width: 70,
    height: 85,
    cardStyle : 'black',
    soldiers: soldierCount/2 
}
export const card3 = {
    x:500,
    y:10,
    width: 70,
    height: 85,
    cardStyle: 'black'
}
export const card4 = {
    x:740,
    y:10,
    width: 70,
    height: 85,
    cardStyle: 'black'
}

export function chooseFromDeck(ctx){

    if(collision(mouse , card1) && mouse.clicked){
        varUtils[6] = 1;
    }
    else if(collision(mouse , card2) && mouse.clicked) varUtils[6] = 2;
    else if(collision(mouse , card3) && mouse.clicked) varUtils[6] = 3;
    else if(collision(mouse , card4) && mouse.clicked) varUtils[6] = 4;
    if(varUtils[6] === 1){
        card1.cardStyle = 'Gold';
        card4.cardStyle = 'Black';
        card2.cardStyle = 'Black';
        card3.cardStyle = 'black';
    }
    else if(varUtils[6] === 2){
        card2.cardStyle = 'Gold';
        card1.cardStyle = 'Black';
        card4.cardStyle = 'Black';
        card3.cardStyle = 'black';
    }
    else if(varUtils[6] === 3){
        card1.cardStyle = 'Black';
        card2.cardStyle = 'Black';
        card4.cardStyle = 'black';
        card3.cardStyle = 'gold';
    }
    else if(varUtils[6] === 4){
        card1.cardStyle = 'Black';
        card2.cardStyle = 'Black';
        card3.cardStyle = 'black';
        card4.cardStyle = 'gold';
    }
    else{
        card1.cardStyle = 'Black';
        card2.cardStyle = 'Black';
        card3.cardStyle = 'black';
        card4.cardStyle = 'black';
    }
    ctx.lineWidth = 1;
    ctx.fillStyle = 'rgba(0 , 0 ,0 ,0.2)'
    ctx.fillRect(card1.x , card1.y , card1.width , card1.height);
    ctx.strokeStyle = card1.cardStyle;
    ctx.strokeRect(card1.x , card1.y , card1.width , card1.height);
    ctx.fillStyle = 'white'
    ctx.font = '20px Orbitron'
    ctx.fillText(card1.soldiers , 60 , 90);
    ctx.drawImage(defender1 , 0 , 0 , 194 , 194 , 0 , 5 , 194/2 , 194/2);

    ctx.fillStyle = 'rgba(0 , 0 ,0 ,0.2)'
    ctx.fillRect(card2.x , card2.y , card2.width , card2.height);
    ctx.strokeStyle = card2.cardStyle;
    ctx.strokeRect(card2.x , card2.y , card2.width , card2.height);
    ctx.drawImage(defender2 , 0 , 0 , 194 , 194 , 80 , 5 , 194/2 , 194/2);
    ctx.fillStyle = 'white'
    ctx.font = '20px Orbitron'
    ctx.fillText(card2.soldiers , 143 , 90);

    ctx.fillStyle = 'rgba(0 , 0 ,0 ,0.2)'
    ctx.fillRect(card3.x , card3.y , card3.width , card3.height);
    ctx.strokeStyle = card3.cardStyle;
    ctx.strokeRect(card3.x , card3.y , card3.width , card3.height);
    ctx.drawImage(resourceCollectorImage , 0 , 0 , 270 , 270 , 480 , 5 , 194/2 , 194/2);
    ctx.fillStyle = 'green';
    ctx.font = '20px Orbitron';
    ctx.fillText("Resource Collector" , card3.x+10 , card3.y+20);
    ctx.fillText("1000" , card3.x+70 , card3.y+40);

    ctx.fillStyle = 'rgba(0 , 0 ,0 ,0.2)'
    ctx.fillRect(card4.x , card4.y , card4.width , card4.height);
    ctx.strokeStyle = card4.cardStyle;
    ctx.strokeRect(card4.x , card4.y , card4.width , card4.height);
    ctx.drawImage(barrackImage , 0 , 0 , 563 , 563 , 725 , 5 , 194/2 , 194/2);
    ctx.fillStyle = 'red';
    ctx.font = '20px Orbitron';
    ctx.fillText("Barrack" , card4.x+10 , card4.y+20);
    ctx.fillText("3000" , card4.x+70 , card4.y+40);
    
}