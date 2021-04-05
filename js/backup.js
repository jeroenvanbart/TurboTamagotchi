const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
canvas.width = 800;
canvas.height = 500;
let score = 0;
let gameFrame = 0;
ctx.font = '50px Georgia';
let gameSpeed = 1;
let objectSpeed = 0.2;
let objectAmmount = 250;

//mouse position
let canvasPosition = canvas.getBoundingClientRect();
const mouse = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    click: false
}

canvas.addEventListener("mousedown", function(event){
    mouse.click = true;
    mouse.x = event.x - canvasPosition.left;
    mouse.y = event.y - canvasPosition.top;
})

canvas.addEventListener("mouseup", function(){
    mouse.click = false;
})

//player
const playerLeft = new Image();
playerLeft.src = "./images/beeLeft.png"
const playerRight = new Image();
playerRight.src = "./images/beeRight.png"

class Player {
    constructor(){
        this.x = canvas.width/2;
        this.y = canvas.height/2;
        this.radius = 50;
        this.angle = 0;
        this.frameX = 0;
        this.frameY = 0;
        this.frame = 0;
        this.spriteWidth = 512;
        this.spriteHeight = 512;
    }
    update(){
        const dx = this.x - mouse.x;
        const dy = this.y - mouse.y;
        const theta = Math.atan2(dy, dx);
        this.angle = theta;
        if (mouse.x != this.x){
            this.x -= dx/30;
        }
        if (mouse.y != this.y){
            this.y -= dy/30;
        }
        //dx/dy/30 = player movement speed
    }
    draw(){
        if (mouse.click) {
            ctx.lineWidth = 0.2;
            ctx.beginPath();
            ctx.moveTo(this.x, this.y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.stroke();

        }
        ctx.fillStyle ="red";
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI *2);
        ctx.fill();
        ctx.closePath();

        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle)

        if (this.x >= mouse.x){
            ctx.drawImage(playerLeft, this.frameX * this.spriteWidth, this.frameY * this.spriteHeight, this.spriteWidth, this.spriteHeight, 0 -65, 0 -65, this.spriteWidth/4, this.spriteHeight/4);
        } else{
            ctx.drawImage(playerRight, this.frameX * this.spriteWidth, this.frameY * this.spriteHeight, this.spriteWidth, this.spriteHeight, 0 -65, 0 -65, this.spriteWidth/4, this.spriteHeight/4);
        }
        ctx.restore();

        
    }
}

const player = new Player();

// objects
const foodArray = [];

class Food {
    constructor(){
        this.x = Math.random() * canvas.width;
        this.y = canvas.height + 100;
        this.radius = 50;
        this.speed = Math.random() * 2 + objectSpeed;
        this.distance;
        this.counted = false;
        this.sound = Math.random() <= 0.5 ? "sound1" : "sound2";

    }
    update(){
        this.y -= this.speed;
        // moves bubbles up
        const dx = this.x - player.x;
        const dy = this.y - player.y;
        this.distance = Math.sqrt(dx * dx + dy * dy);
    }
    draw(){
        ctx.fillStyle ="blue";
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI *2);
        ctx.fill();
        ctx.closePath();
        ctx.stroke();

    }
}

const bubbleSound1 = document.createElement("audio");
bubbleSound1.src = "./audio/mixkit-water-bubble-1317.wav";
const bubbleSound2 = document.createElement("audio");
bubbleSound2.src = "./audio/mixkit-cartoon-bubbles-popping-732.wav";


function handleFood(){
    if (gameFrame % objectAmmount == 0){
        foodArray.push(new Food());
    }
    for (let i=0; i < foodArray.length; i++){
        foodArray[i].update();
        foodArray[i].draw();      
         if (foodArray[i].y < 0 - foodArray[i].radius * 2){
            foodArray.splice(i, 1);
            i--;
        }else if (foodArray[i].distance < foodArray[i].radius + player.radius){
                //  detect collision
                //add score
                if (!foodArray[i].counted){
                    if (foodArray[i].sound == "sound1"){
                        // bubbleSound1.play();
                    }else{
                        // bubbleSound2.play();
                    }
                    score++
                    foodArray[i].counted = true;
                    foodArray.splice(i, 1);
                    i--;  
                }                                   
        }      
    }
}

const bubblesArray = [];

class Bubble {
    constructor(){
        this.x = Math.random() * canvas.width;
        this.y = canvas.height - canvas.height - 100;
        this.radius = 50;
        this.speed = Math.random() * 2 + objectSpeed;
        this.distance;
        this.counted = false;
        this.sound = Math.random() <= 0.5 ? "sound1" : "sound2";

    }
    update(){
        this.y += this.speed;
        // moves bubbles up
        const dx = this.x - player.x;
        const dy = this.y - player.y;
        this.distance = Math.sqrt(dx * dx + dy * dy);
    }
    draw(){
        ctx.fillStyle ="purple";
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI *2);
        ctx.fill();
        ctx.closePath();
        ctx.stroke();

    }
}

// const bubbleSound1 = document.createElement("audio");
// bubbleSound1.src = "./audio/mixkit-water-bubble-1317.wav";
// const bubbleSound2 = document.createElement("audio");
// bubbleSound2.src = "./audio/mixkit-cartoon-bubbles-popping-732.wav";


function handleBubles(){
    if (gameFrame % objectAmmount == 0){
        bubblesArray.push(new Bubble());
    }
    for (let i=0; i < bubblesArray.length; i++){
        bubblesArray[i].update();
        bubblesArray[i].draw();      
         if (bubblesArray[i].y < 0 - bubblesArray[i].radius * 2){
            bubblesArray.splice(i, 1);
            i--;
        }else if (bubblesArray[i].distance < bubblesArray[i].radius + player.radius){
                //  detect collision
                //add score
                if (!bubblesArray[i].counted){
                    if (bubblesArray[i].sound == "sound1"){
                        // bubbleSound1.play();
                    }else{
                        // bubbleSound2.play();
                    }
                    score++
                    bubblesArray[i].counted = true;
                    bubblesArray.splice(i, 1);
                    i--;  
                }                                   
        }      
    }
}

//repeating background
const background = new Image();
background.src = "./images/background.jpeg"

//moving background
const bg = {
    x1:0,
    x2: canvas.width,
    y:0,
    width: canvas.width,
    height: canvas.height
}

function handleBackground(){
    //moving background
    bg.x1 -= 0.2;
    if (bg.x1 < -bg.width){ bg.x1 =bg.width;}
    bg.x2 -= 0.2;
    if (bg.x2 < -bg.width){ bg.x2 =bg.width;}

    //needed for static background ,0,0,canvas.width,canvas.height
    ctx.drawImage(background, bg.x1,bg.y,bg.width, bg.height);
    ctx.drawImage(background, bg.x2,bg.y,bg.width, bg.height);
}


// animation loop


function animate(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    handleBackground()
    handleFood()
    handleBubles()
    player.update();
    player.draw();
    ctx.fillStyle ="black"
    ctx.fillText(`score:` + score, 10, 50);
    gameFrame++;
    requestAnimationFrame(animate);

}
animate();

window.addEventListener("resize", function(){
    canvasPosition = canvas.getBoundingClientRect();
})