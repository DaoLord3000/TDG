export const floatingMessages = [];

export class floatingMessage{
    constructor(value , x , y , size , color){
        this.value = value;
        this.x = x;
        this.y = y;
        this.size = size;
        this.lifespan = 0;
        this.color = color;
        this.opacity = 1;
    }
    update(){
        this.y -= 0.3;
        this.lifespan+=1;
        if(this.opacity > 0.03) this.opacity -=0.03;
    }
    draw(ctx){
        ctx.globalAlpha = this.opacity;
        ctx.fillStyle = this.color;
        ctx.font = this.size + "px Orbitron";
        ctx.fillText(this.value , this.x , this.y);
        ctx.globalAlpha = 1;
    }
}

export function handleFloatingMessages(ctx) {
    for (let i = 0; i < floatingMessages.length; i++) {
        floatingMessages[i].update();
        floatingMessages[i].draw(ctx);
        if(floatingMessages[i].lifespan >= 50){
            floatingMessages.splice(i ,1);
            i--;
        }
        
    }
}