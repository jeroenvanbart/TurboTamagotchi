const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
const progressBar = document.getElementById('progress-bar');
canvas.width = 800;
canvas.height = 500;
ctx.font = '30px Georgia';

let love = 0;
let gameFrame = 0;
let gameSpeed = 1;
let health = 100;

let objectSpeed = 0.2;
let objectAmmount = 250;
let loveSpeed = 0.5;
let loveAmmount = 150;
let bomsSpeed = 0.5;
let bomsAmmount = 150;
let playerSpeed = 30;

let lovePointsNeeded = 50;
let bomCountMinHealth = 10;

let gameOver = false;
let gameWin = false;
let gameStop =false;

const foodArray = [];
const waterArray = [];
const heartArray = [];
const bomsArray = [];

const background = new Image();
background.src = "./images/background.jpeg"
const playerLeft = new Image();
playerLeft.src = "./images/beeLeft.png"
const playerRight = new Image();
playerRight.src = "./images/beeRight.png"
const foodAppleImage = new Image();
foodAppleImage.src = "./images/orange.png"
const waterImage = new Image();
waterImage.src = "./images/water_ball_05.png"
const heartImage = new Image();
heartImage.src = "./images/face_on_heart.png"
const bomsImage = new Image();
bomsImage.src = "./images/spiky_ball.png"
const eatingSound1 = document.createElement("audio");
eatingSound1.src = "./audio/mixkit-hungry-man-eating-2252.wav";
const eatingSound2 = document.createElement("audio");
eatingSound2.src = "./audio/mixkit-human-male-enjoy-humm-129.wav";
const waterSound1 = document.createElement("audio");
waterSound1.src = "./audio/mixkit-pouring-a-small-drink-142.wav";
const waterSound2 = document.createElement("audio");
waterSound2.src = "./audio/mixkit-cartoon-bubbles-popping-732.wav";
const heartSound1 = document.createElement("audio");
heartSound1.src = "./audio/mixkit-little-double-kiss-2189.wav";
const heartSound2 = document.createElement("audio");
heartSound2.src = "./audio/mixkit-little-double-kiss-2189.wav";
const bomsSound1 = document.createElement("audio");
bomsSound1.src = "./audio/mixkit-shot-light-explosion-1682.wav";
const bomsSound2 = document.createElement("audio");
bomsSound2.src = "./audio/mixkit-shot-light-explosion-1682.wav";
const gameOverSound = document.createElement("audio");
gameOverSound.src = "./audio/mixkit-retro-game-over-1947.wav";
const gameWinSound = document.createElement("audio");
gameWinSound.src = "./audio/mixkit-arcade-video-game-scoring-presentation-274.wav";
const backgroundSound = document.createElement("audio");
backgroundSound.src = "./audio/mixkit-river-atmosphere-in-a-forest-2450.wav";


const bg = {
    x1:0,
    x2: canvas.width,
    y:0,
    width: canvas.width,
    height: canvas.height
}

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
    }
    draw(){
        if (mouse.click) {
            ctx.lineWidth = 0.2;
            ctx.beginPath();
            ctx.moveTo(this.x, this.y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.stroke();
        }
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI *2);
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
    Gameover (){
        if (gameOver === true){
            ctx.drawImage(playerRight, 350 , 350, this.spriteWidth/4, this.spriteHeight/4);
        }
    } 
    Gamewin (){
        if (gameWin === true){
            ctx.drawImage(playerLeft, 350 , 350, this.spriteWidth/4, this.spriteHeight/4);
        }
    }    
}
const player = new Player();
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
        // moves bubbles up
        const dx = this.x - player.x;
        const dy = this.y - player.y;
        this.distance = Math.sqrt(dx * dx + dy * dy);
    }
    draw(){
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI *2);
        ctx.closePath();
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
                if (!foodArray[i].counted){
                    if (foodArray[i].sound == "sound1"){
                        eatingSound1.play();
                    }else{
                        eatingSound2.play();
                    }
                    if(health <99){health +=2;}
                    foodArray[i].counted = true;
                    foodArray.splice(i, 1);
                    i--;  
                }                                   
        }      
    }
}
class Water {
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
        const dx = this.x - player.x;
        const dy = this.y - player.y;
        this.distance = Math.sqrt(dx * dx + dy * dy);
    }
    draw(){
        ctx.beginPath();
        ctx.arc(this.x, this.y, 30, 0, Math.PI *2);
        ctx.closePath();
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
                if (!waterArray[i].counted){
                    if (waterArray[i].sound == "sound1"){
                        waterSound1.play();
                    }else{
                        waterSound2.play();
                    }
                    if(health <99){health +=2;}
                    waterArray[i].counted = true;
                    waterArray.splice(i, 1);
                    i--;  
                }                                   
        }      
    }
}
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
        const dx = this.x - player.x;
        const dy = this.y - player.y;
        this.distance = Math.sqrt(dx * dx + dy * dy);
    }
    draw(){
        ctx.beginPath();
        ctx.arc(this.x, this.y, 30, 0, Math.PI *2);
        ctx.closePath();
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
                if (!heartArray[i].counted){
                    if (heartArray[i].sound == "sound1"){
                        heartSound1.play();
                    }else{
                        heartSound2.play();
                    }
                    love += 1;
                    if(love === lovePointsNeeded){
                        gameWin = true; 
                    }
                    heartArray[i].counted = true;
                    heartArray.splice(i, 1);
                    i--;  
                }                                   
        }      
    }
}
class Boms{
    constructor(){
        this.x = Math.random() * canvas.width;
        this.y = canvas.height + 100;
        this.radius = 50;
        this.speed = Math.random() * 2 + bomsSpeed;
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
        ctx.beginPath();
        ctx.arc(this.x, this.y, 25, 0, Math.PI *2);
        ctx.closePath();
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
                if (!bomsArray[i].counted){
                    if (bomsArray[i].sound == "sound1"){
                        bomsSound1.play();
                    }else{
                        bomsSound2.play();
                    }
                    if (love>0) {love -=1};
                    if(health <= 0){
                        health = 0;
                        gameOver =true;
                    }else if(health > 0){
                        health -= bomCountMinHealth;
                    }
                    bomsArray[i].counted = true;
                    bomsArray.splice(i, 1);
                    i--;  
                }                                   
        }   
    }  
}

function handleBackground(){
    bg.x1 -= 0.1;
    if (bg.x1 < -bg.width){ bg.x1 =bg.width;}
    bg.x2 -= 0.1;
    if (bg.x2 < -bg.width){ bg.x2 =bg.width;}
    ctx.drawImage(background, bg.x1,bg.y,bg.width, bg.height);
    ctx.drawImage(background, bg.x2,bg.y,bg.width, bg.height);
}

function progress(width){
    if (health < 20){
        progressBar.id ='progress-bar3';
    }else if(health < 40){
        progressBar.id ='progress-bar2';  
        }else {progressBar.id ='progress-bar';
    }
    let widthString = width.toString() + "%"
    progressBar.style.width = widthString;
}

function moreBoms(){
    if (gameFrame % 1000 === 0 && gameFrame < 10001){
        if (bomsAmmount < 0){bomsAmmount -= 10;};
        bomsAmmount -= 10;
        bomsSpeed += 0.5;
    }
}

function moreLove(){
    if (gameFrame % 1000 === 0 && gameFrame < 10001){
        if (loveAmmount < 0){loveAmmount -= 10;};
        loveAmmount -= 10;
        loveSpeed += 0.2;
    }
}

function gameFreeze(){
    if (gameOver === true || gameWin ===true){
        gameStop = true;
    }
}

function handleGameOver(){
    if (gameOver === true){
    ctx.fillStyle ="black";
    ctx.fillText("GAME OVER!", 315, 250 );
    gameOverSound.play();
    gameOver = true;
    }
}

function handleGameWin(){
    if (gameWin === true){
    ctx.fillStyle ="black";
    ctx.fillText("YOU WON!, you reached " + love + " Lovepoints", 145, 250 );
    gameWinSound.play();
    gameWin = true;
    }
}

function playBackgroundMusic(){
    if (gameStop === false) {backgroundSound.play().loop;
    }else{backgroundSound.pause()}

}

function animate(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    handleBackground();
    gameFreeze() 
    
    if (!gameStop){handleFood();
    handleHeart();
    handleWater();
    handleBoms();
    moreBoms();
    moreLove();
    }

    progress(health);
    handleGameOver()
    handleGameWin()
    gameFrame++;
    
    if (!gameStop){ 
        player.update();
        player.draw()
    };

    player.Gameover ()
    player.Gamewin ()
    ctx.fillStyle ="black";
    ctx.fillText(`Love:` + love, 10, 50);
    playBackgroundMusic();
if (!gameStop) requestAnimationFrame(animate)
}

startGame()
resetGame()

function startGame(){
    ctx.fillStyle ="darkblue";
    ctx.fillText("Click your mouse to navigate me.", 190, 100 );
    ctx.fillText("Give me food and water to increase my health.", 110, 150 );
    ctx.fillText("Give me "+ lovePointsNeeded + " hearts and you will win.", 174, 200 );
    ctx.fillText("Avoid getting hit by spiky bombs,", 194, 250 );
    ctx.fillText("since they cost health and love.", 210, 300 );
    ctx.fillText("I am to cute to die!", 280, 350 );
    let start = document.getElementById("startbutton").addEventListener("click", function(){
        animate();
    }, {once: true});
}

function resetGame(){
    let reset = document.getElementById("resetbutton").addEventListener("click", function(){
    });
}

window.addEventListener("resize", function(){
    canvasPosition = canvas.getBoundingClientRect();
})