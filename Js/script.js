import {handleProjectiles} from "./Projectile.js";
import {floatingMessage , floatingMessages , handleFloatingMessages} from './FloatingMessage.js';
import {cellSize ,cellGap, mouse , varUtils , handleGameGrid , createGrid, collision , gameObjects} from './Utils.js';
import {Defenders , chooseFromDeck , handleDefenders , defenders , card1 , card2 , barrackImage , resourceCollectorImage} from './defender.js'
import { handleEnemies  , enemies} from "./enemy.js";
import { handleResources } from "./resource.js";
import { handleGameStatus } from "./BasicUtils.js";
import { soldierCount } from "./defender.js";

//global variables
const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
canvas.width = 900;
canvas.height = 600;
let utilVar = varUtils;
const townHalls = [];
const resourceCollectors = [];
const barracks = [];
let trainedDefenders = 0;
let starting = true;
const townHallImage = new Image();
townHallImage.src = 'spritesheets\\townHall.png'



canvas.addEventListener('mousedown' , function(){
    mouse.clicked = true;
});
canvas.addEventListener('mouseup' , function(){
    mouse.clicked = false;
});
export let canvasPosition = canvas.getBoundingClientRect();
canvas.addEventListener('mousemove' , function(e){
    mouse.x = e.x - canvasPosition.left;
    mouse.y = e.y - canvasPosition.top;
});
canvas.addEventListener('mouseleave' , function(e){
    mouse.x = 10;
    mouse.y = 10;
})

//game Board
const controlsBar = {
    width: canvas.width,
    height: cellSize * 2
}


createGrid(canvas);
//HQ

class Townhall{
    constructor(baseLevel , x , y){
        this.level = baseLevel;
        this.health = 500;
        this.resourceLimit = utilVar[0];
        this.x = x;
        this.y = y;
        this.width=cellSize*3;
        this.height=cellSize*3;
        this.territoryBoost = true;
        this.timer = 0;
        this.exists = false;
    }

    draw(){
        ctx.fillStyle = "rgba(0 , 0 ,0 ,0.2)";
        ctx.drawImage(townHallImage , 0 , 0 , 519 , 562 , this.x , this.y , this.width , this.height);
        // ctx.drawImage()
        ctx.fillStyle = 'Black';
        ctx.font = '40px Orbitron';
        ctx.fillText(Math.floor(this.health) , this.x , this.y);
    }
}
function drawTownHall(){
    if(starting){
        if(townHalls.length === 0){
            townHalls.push(new Townhall(varUtils[7] ,100 , 320 ));
            gameObjects['Townhall'] = townHalls
        }
    }
   
}

function handleTownHall(){
   
        for (let i = 0; i < townHalls.length; i++) {
            townHalls[i].draw(); 
            for (let i = 0; i < enemies.length; i++) {
                if(townHalls[i] && collision(townHalls[i] , enemies[i])){
                    enemies[i].movement = 0;
                    townHalls[i].health -= 2;
                }
            }
            if(townHalls[i] && townHalls[i].health <=0){
                townHalls.splice(i,1);
                i--;
                starting = false;
                varUtils[7] -= 1;
            }
        }    
   
}

class ResourceCollector{

    constructor(x , y ){
        this.x = x;
        this.y = y;
        this.resource_x = this.x + 25;
        this.resource_y = this.y -30;
        this.resource_radius = 30;
        this.level = 1;
        this.width = cellSize * 2;
        this.height = cellSize*2;
        this.collectionNumber = 0;
        this.health = 500 * (0.8 * this.level);
        this.genResource = 300 + (300 * (0.3*this.level));
    }

    update() {
        if (utilVar[2] % 1000 === 0) this.collectionNumber++;
        if(this.collectionNumber > 0) this.drawCollection();
    }

    draw() {
        ctx.fillStyle = 'Black';
        ctx.font = '15px Orbitron';
        ctx.fillText(Math.floor(this.health), this.x, this.y + 15);
        ctx.fillStyle = 'green';
        ctx.drawImage(resourceCollectorImage , 0 , 0 , 270 , 270 , this.x , this.y , this.width , this.height);
        
    }
    drawCollection() {
        ctx.fillStyle = 'Orange';
        ctx.beginPath();
        ctx.arc(this.resource_x, this.resource_y, this.resource_radius, 0, Math.PI * 2);
        ctx.fill();
    }
    

}


function HandleResourceCollectiors(){
    if(starting){
        if(resourceCollectors.length === 0){
            resourceCollectors.push(new ResourceCollector(250 , 275));
            gameObjects['resourceCollector'] = resourceCollectors;
        }
    }  
    for (let i = 0; i < resourceCollectors.length; i++) {
        resourceCollectors[i].draw();
        resourceCollectors[i].update();
        for (let j = 0; j < enemies.length; j++) {
            if(resourceCollectors[i] && collision(resourceCollectors[i] , enemies[j])){
                enemies[j].movement = 0;
                resourceCollectors[i].health -= 5;
                utilVar[0] -= 2;
            }
        }  
        if(resourceCollectors[i] && resourceCollectors[i].health<=0){
            resourceCollectors.splice(i,1);
            starting = false;
            i--;
        }  
    }
   
}

class Barrack{
    constructor(x , y){
        this.x = x;
        this.y = y;
        this.width = cellSize *2;
        this.height = cellSize*3;
        this.soldierCost = 100;
        this.level = 1;
        this.solType = 0;
        this.resource_x = this.x  + 25;
        this.resource_y = this.y ;
        this.resource_radius = 30;
        this.health = 500 + (500 * 0.2 * this.level);
        this.soldierNumber = 0;
        this.troops = 0;
    }
    draw(){
        ctx.fillStyle = 'red';
        ctx.drawImage(barrackImage , 0 , 0 , 563 , 563 , this.x , this.y , this.width , this.height);
        ctx.fillStyle = 'Black';
        ctx.font = '10px Orbitron';
        ctx.fillText("Barracks", this.x, this.y + 20);
        ctx.fillText(Math.floor(this.health), this.x, this.y + 50);
    }
    update(){
        if (utilVar[2] % 1000 === 0 && utilVar[0] > this.soldierCost && this.soldierNumber < 10) {
            this.soldierNumber++;
            console.log(varUtils[0]);
        }
        if(this.soldierNumber > 0) this.drawSoldier();
    }
    drawSoldier() {
        ctx.fillStyle = 'Orange';
        ctx.beginPath();
        ctx.arc(this.resource_x, this.resource_y, this.resource_radius, 0, Math.PI * 2);
        ctx.fill();
    }
}

function barrackHandler() {
    if(starting){
        if(barracks.length === 0){
            barracks.push(new Barrack(350 , 150));
            gameObjects['barrack'] = barracks;
        }
    }
        for (let i = 0; i < barracks.length; i++) {
            barracks[i].draw();
            barracks[i].update();    
            for (let j = 0; j < enemies.length; j++) {
                if(barracks[i] && collision(barracks[i] , enemies[j])){
                    enemies[j].movement = 0;
                    barracks[i].health -= 5;
                    utilVar[0] -= 1;
                }
            }  
            if(barracks[i] && barracks[i].health<=0){
                barracks.splice(i,1);
                starting = false;
                i--;
            }
        }
}
//utilities

canvas.addEventListener('click' , function(e){
    let gridPositionX = mouse.x - (mouse.x % cellSize) + cellGap;
    let gridPositionY = mouse.y - (mouse.y % cellSize) + cellGap;
    if(gridPositionY < cellSize * 2) return;
    for(var key in gameObjects){
        var value = gameObjects[key];
        for (let i = 0; i < value.length; i++) {
            if(utilVar[6] === 1 || utilVar[6] === 2){
                if(collision(value[i] ,new Defenders(gridPositionX , gridPositionY))) return;
            }
            if(utilVar[6] === 3){
                if(collision(value[i] , new ResourceCollector(gridPositionX , gridPositionY))) return;
            }
            if(utilVar[6] === 4){
                if(collision(value[i] , new Barrack(gridPositionX , gridPositionY))) return;
            }
        }
    }
    if(utilVar[6] === 1 || utilVar[6] === 2) addDefender(gridPositionX , gridPositionY);
    if(utilVar[6] === 3) addResourceCollector(gridPositionX , gridPositionY);
    if(utilVar[6] === 4) addBarrack(gridPositionX , gridPositionY);
    
   
})
function addBarrack(gridPositionX , gridPositionY){
    let cost = 3000
    if(utilVar[0]>=cost){
        barracks.push(new Barrack(gridPositionX , gridPositionY));
        gameObjects['barrack'] = barracks;
        utilVar[0]-= cost;
    }else{
        floatingMessages.push(new floatingMessage("Need more Resources" , mouse.x , mouse.y , 15 , 'blue'))
    }
}
function addResourceCollector(gridPositionX , gridPositionY){
   
    let cost = 1000;
    if(utilVar[0] >= cost){
        resourceCollectors.push(new ResourceCollector(gridPositionX , gridPositionY));
        gameObjects['resourceCollector'] = resourceCollectors;
        utilVar[0] -= cost;
    }else{
        floatingMessages.push(new floatingMessage("Need more Resources" , mouse.x , mouse.y , 15 , 'blue'))
    }
}
function addDefender(gridPositionX , gridPositionY){
    let cost = 100;
    if(utilVar[0] >= cost){
        defenders.push(new Defenders(gridPositionX , gridPositionY))
        gameObjects['defender'] = defenders;
        if(utilVar[6] === 1) card1.soldiers-=1;
        if(utilVar[6] === 2) card2.soldiers-=1;
        utilVar[0] -= cost;
    }else{
        floatingMessages.push(new floatingMessage("Need more Resources" , mouse.x , mouse.y , 15 , 'blue'))
    }
}
function TrainTroops(){
    for (let i = 0; i < barracks.length; i++) {
        if(collision(barracks[i] , mouse) && mouse.clicked && barracks[i].soldierNumber > 0){
            card1.soldiers += barracks[i].soldierNumber;
            card2.soldiers += barracks[i].soldierNumber;
            utilVar[0] = utilVar[0] - (barracks[i].soldierNumber * barracks[i].soldierCost);
            barracks[i].soldierNumber = 0;  
            console.log(barracks[i]);
        }        
    }
}
function collectResources(){
    for (let i = 0; i < resourceCollectors.length; i++) {
        if(collision(resourceCollectors[i] , mouse) && mouse.clicked && resourceCollectors[i].collectionNumber > 0){
            utilVar[0] += resourceCollectors[i].genResource * (resourceCollectors[i].collectionNumber * 0.3);            
            resourceCollectors[i].collectionNumber = 0;
        }
    }
}

function animate(){
    ctx.clearRect(0 , 0 , canvas.width , canvas.height);
    ctx.fillStyle = 'Blue';
    ctx.fillRect(0,0,controlsBar.width , controlsBar.height);
    barrackHandler()
    handleGameGrid(ctx);
    drawTownHall();
    handleTownHall();
    HandleResourceCollectiors()
    handleDefenders(ctx);
    handleEnemies(canvas , ctx);
    handleProjectiles(ctx , canvas);
    handleResources(ctx ,canvas);
    chooseFromDeck(ctx , soldierCount);
    TrainTroops();
    collectResources();
    handleGameStatus(ctx , varUtils);
    handleFloatingMessages(ctx);
    utilVar[2]++;
    if(!utilVar[4]) requestAnimationFrame(animate);
}
animate();


window.addEventListener('resize' , function () {
    canvasPosition = canvas.getBoundingClientRect();
})