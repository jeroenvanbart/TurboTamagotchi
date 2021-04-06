const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
canvas.width = 800;
canvas.height = 500;

let love = 0;
let gameFrame = 0;
ctx.font = '50px Georgia';
let gameSpeed = 1;
let objectSpeed = 0.2;
let objectAmmount = 250;
let loveSpeed = 0.5;
let loveAmmount = 150;
let bomsSpeed = 0.5;
let bomsAmmount = 150;
let playerSpeed = 30;

const foodArray = [];
const waterArray = [];
const heartArray = [];
const bomsArray = [];

let health = 100;

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
        this.radius = 40;
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
            this.x -= dx/playerSpeed;
        }
        if (mouse.y != this.y){
            this.y -= dy/playerSpeed;
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
        // ctx.fill();
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


const foodAppleImage = new Image();
foodAppleImage.src = "./images/orange.png"
const bubbleSound1 = document.createElement("audio");
bubbleSound1.src = "./audio/mixkit-water-bubble-1317.wav";
const bubbleSound2 = document.createElement("audio");
bubbleSound2.src = "./audio/mixkit-cartoon-bubbles-popping-732.wav";


class Food {
    constructor(){
        this.x = Math.random() * canvas.width;
        this.y = canvas.height + 100;
        this.radius = 35;
        this.speed = Math.random() * 2 + objectSpeed;
        this.distance;
        this.counted = false;
        this.sound = Math.random() <= 0.5 ? "sound1" : "sound2";
        

    }
    update(){
        this.y -= this.speed;
        const dx = this.x - player.x;
        const dy = this.y - player.y;
        this.distance = Math.sqrt(dx * dx + dy * dy);
    }
    draw(){
        ctx.fillStyle ="blue";
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI *2);
        // ctx.fill();
        ctx.closePath();
        // ctx.stroke();
        ctx.drawImage(foodAppleImage,this.x -37,this.y -37, this.radius *2, this.radius * 2);
        ctx.restore();
        

    }
}




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
                    if(health <100){health +=2;}
                    foodArray[i].counted = true;
                    foodArray.splice(i, 1);
                    i--;  
                }                                   
        }      
    }
}


const waterImage = new Image();
waterImage.src = "./images/water_ball_05.png"
// const bubbleSound1 = document.createElement("audio");
// bubbleSound1.src = "./audio/mixkit-water-bubble-1317.wav";
// const bubbleSound2 = document.createElement("audio");
// bubbleSound2.src = "./audio/mixkit-cartoon-bubbles-popping-732.wav";

class Water {
    constructor(){
        this.x = Math.random() * canvas.width;
        this.y = canvas.height - canvas.height - 100;
        this.radius = 50;
        this.speed = Math.random() * 2 + objectSpeed;
        this.distance;
        this.counted = false;
        // this.sound = Math.random() <= 0.5 ? "sound1" : "sound2";

    }
    update(){
        this.y += this.speed;
        // moves bubbles up/down
        const dx = this.x - player.x;
        const dy = this.y - player.y;
        this.distance = Math.sqrt(dx * dx + dy * dy);
    }
    draw(){
        ctx.fillStyle ="green";
        ctx.beginPath();
        ctx.arc(this.x, this.y, 30, 0, Math.PI *2);
        // ctx.fill();
        ctx.closePath();
        // ctx.stroke();
        ctx.drawImage(waterImage,this.x -55,this.y -55, this.radius *2.2, this.radius * 2.2);
        ctx.restore();

    }
}




function handleWater(){
    if (gameFrame % objectAmmount == 0){
        waterArray.push(new Water());
    }
    for (let i=0; i < waterArray.length; i++){
        waterArray[i].update();
        waterArray[i].draw();      
         if (waterArray[i].y < 0 - waterArray[i].radius * 2){
            waterArray.splice(i, 1);
            i--;
        }else if (waterArray[i].distance < waterArray[i].radius + player.radius){
                //  detect collision
                //add score
                if (!waterArray[i].counted){
                    if (waterArray[i].sound == "sound1"){
                        // bubbleSound1.play();
                    }else{
                        // bubbleSound2.play();
                    }
                    if(health <100){health +=2;}
                    waterArray[i].counted = true;
                    waterArray.splice(i, 1);
                    i--;  
                }                                   
        }      
    }
}

const heartImage = new Image();
heartImage.src = "./images/face_on_heart.png"
// const bubbleSound1 = document.createElement("audio");
// bubbleSound1.src = "./audio/mixkit-water-bubble-1317.wav";
// const bubbleSound2 = document.createElement("audio");
// bubbleSound2.src = "./audio/mixkit-cartoon-bubbles-popping-732.wav";

class Heart {
    constructor(){
        this.x = Math.random() * canvas.width;
        this.y = canvas.height - canvas.height - 100;
        this.radius = 50;
        this.speed = Math.random() * 2 + loveSpeed;
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
        ctx.arc(this.x, this.y, 30, 0, Math.PI *2);
        // ctx.fill();
        ctx.closePath();
        // ctx.stroke();
        ctx.drawImage(heartImage,this.x -30,this.y -28, this.radius *1.2, this.radius * 1.2);
        ctx.restore();

    }
}




function handleHeart(){
    if (gameFrame % loveAmmount == 0){
        heartArray.push(new Heart());
    }
    for (let i=0; i < heartArray.length; i++){
        heartArray[i].update();
        heartArray[i].draw();      
         if (heartArray[i].y < 0 - heartArray[i].radius * 2){
            heartArray.splice(i, 1);
            i--;
        }else if (heartArray[i].distance < heartArray[i].radius + player.radius){
                //  detect collision
                //add score
                if (!heartArray[i].counted){
                    if (heartArray[i].sound == "sound1"){
                        // bubbleSound1.play();
                    }else{
                        // bubbleSound2.play();
                    }
                    love++
                    heartArray[i].counted = true;
                    heartArray.splice(i, 1);
                    i--;  
                }                                   
        }      
    }
}

const bomsImage = new Image();
bomsImage.src = "./images/spiky_ball.png"
// const bubbleSound1 = document.createElement("audio");
// bubbleSound1.src = "./audio/mixkit-water-bubble-1317.wav";
// const bubbleSound2 = document.createElement("audio");
// bubbleSound2.src = "./audio/mixkit-cartoon-bubbles-popping-732.wav";

class Boms{
    constructor(){
        this.x = Math.random() * canvas.width;
        this.y = canvas.height + 100;
        this.radius = 50;
        this.speed = Math.random() * 2 + bomsSpeed;
        this.distance;
        this.counted = false;
        // this.sound = Math.random() <= 0.5 ? "sound1" : "sound2";

    }
    update(){
        this.y -= this.speed;
        // moves bubbles up
        const dx = this.x - player.x;
        const dy = this.y - player.y;
        this.distance = Math.sqrt(dx * dx + dy * dy);
    }
    draw(){
        ctx.fillStyle ="yellow";
        ctx.beginPath();
        ctx.arc(this.x, this.y, 25, 0, Math.PI *2);
        // ctx.fill();
        ctx.closePath();
        // ctx.stroke();
        ctx.drawImage(bomsImage,this.x -30,this.y -28, this.radius *1.2, this.radius * 1.2);
        ctx.restore();

    }
}




function handleBoms(){
    if (gameFrame % bomsAmmount == 0){
        bomsArray.push(new Boms());
    }
    for (let i=0; i < bomsArray.length; i++){
        bomsArray[i].update();
        bomsArray[i].draw();      
         if (bomsArray[i].y < 0 - bomsArray[i].radius * 2){
            bomsArray.splice(i, 1);
            i--;
        }else if (bomsArray[i].distance < bomsArray[i].radius + player.radius){
                //  detect collision
                //add score
                if (!bomsArray[i].counted){
                    // if (poisonArray[i].sound == "sound1"){
                    //     // bubbleSound1.play();
                    // }else{
                    //     // bubbleSound2.play();
                    // }
                    if (love>0) {love -=1};
                    if(health >-1){health -=5;}
                    bomsArray[i].counted = true;
                    bomsArray.splice(i, 1);
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
    bg.x1 -= 0.1;
    if (bg.x1 < -bg.width){ bg.x1 =bg.width;}
    bg.x2 -= 0.1;
    if (bg.x2 < -bg.width){ bg.x2 =bg.width;}

    //needed for static background ,0,0,canvas.width,canvas.height
    ctx.drawImage(background, bg.x1,bg.y,bg.width, bg.height);
    ctx.drawImage(background, bg.x2,bg.y,bg.width, bg.height);
}

//progress bar

function progress(width){
    let el = document.getElementById('progress-bar');
    let widthString = width.toString() + "%"
    el.style.width = widthString;
}

//increase difficulty
function moreBoms(){
    if (gameFrame % 1000 === 0 && gameFrame < 10001){
        if (bomsAmmount < 0){bomsAmmount -= 10;};
        bomsAmmount -= 10;
        bomsSpeed += 0.5;
        console.log(gameFrame)
    }
}

function moreLove(){
    if (gameFrame % 1000 === 0 && gameFrame < 10001){
        if (loveAmmount < 0){loveAmmount -= 10;};
        loveAmmount -= 10;
        loveSpeed += 0.2;
        
    }
}

//check win




// animation loop


function animate(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    handleBackground();
    handleFood();
    handleHeart();
    handleWater();
    handleBoms();
    moreBoms();
    moreLove();
    player.update();
    player.draw();
    ctx.fillStyle ="black";
    ctx.fillText(`Love:` + love, 10, 50);
    gameFrame++;
    requestAnimationFrame(animate);
    progress(health);

}
animate();

window.addEventListener("resize", function(){
    canvasPosition = canvas.getBoundingClientRect();
})
