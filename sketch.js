var monkey, monkey_running
var banana, bananaImage, obstacle, obstacleImage
var FoodGroup, obstacleGroup
var score = 0;
var bgI, bg;
var ig;
var bonus = 0;
var starI, star;
var injury = 0;
var gameState = "play";
var starGroup;
var bScoreI, bScore;
var jump, fall, backgroundS, starS, slurp;
var gameOver,restart,gameOverI,restartI;

function preload() {

  monkey_running = loadAnimation("sprite_0.png", "sprite_1.png", "sprite_2.png", "sprite_3.png", "sprite_4.png", "sprite_5.png", "sprite_6.png", "sprite_7.png", "sprite_8.png");

  bananaImage = loadImage("banana.png");
  obstaceImage = loadImage("obstacle.png");
  bgI = loadImage("bg.png");
  obstacleImage = loadImage("obstacle.png");
  bananaImage = loadImage("banana.png");
  starI = loadImage("star.png");
  bScoreI = loadImage("5x.png");
  jump = loadSound("jump.mp3");
  fall = loadSound("fall.mp3");
  starS = loadSound("star.mp3");
  slurp = loadSound("slurp.mp3");
  backgroundS = loadSound("Forest-ambience.mp3");
  gameOverI=loadImage("game over.png");
  restartI=loadImage("restart.png");
}

function setup() {
  createCanvas(600, 300);
  backgroundS.play()
  backgroundS.loop()
  foodGroup = new Group();
  obstacleGroup = new Group();
  starGroup = new Group();
  bg = createSprite(1200, 150, 10, 10);
  bg.addImage(bgI);
  bg.scale = 0.35;


  ig = createSprite(50, 260, 100, 10)
  ig.visible = false;

  monkey = createSprite(50, 220, 10, 10);
  monkey.addAnimation("running", monkey_running)
  monkey.scale = 0.1;

  bScore = createSprite(520, 10, 10, 10);
  bScore.addImage(bScoreI);
  bScore.scale = 0.25;
  bScore.visible = false;
  
  gameOver=createSprite(280,150,10,10);
  gameOver.addImage(gameOverI);
  gameOver.scale=0.7;
  gameOver.visible=false;
  
  restart=createSprite(275,260,10,10);
  restart.addImage(restartI);
  restart.scale=0.1;
  restart.visible=false;
  
  //   monkey.debug=true;
}

function draw() {
  background("white")

  monkey.collide(ig);
  // console.log(monkey.y)

  if (bg.x <= 0) {
    bg.x = 1200;
  }

  if (gameState == "play") {
    monkey.visible = true;
    if ((keyDown("space")) && (monkey.y >= 210)) {
      monkey.velocityY = -13
      jump.play();
      // console.log(bg.velocityX)
    }
    monkey.velocityY = monkey.velocityY + 0.7;
    bg.velocityX = -(4 + 3 * score / 50)

    if (frameCount % round(random(180, 220)) == 0) {
      bananas();
    }
    if (frameCount % 200 == 0) {
      obstacles();
    }
    if (monkey.isTouching(foodGroup) && bonus == 0) {
      foodGroup.destroyEach();
      slurp.play();
      score++
    }

    if (monkey.isTouching(obstacleGroup)) {
      fall.play();
      injury++
      obstacleGroup.destroyEach();
    }
    if (injury == 3) {
      gameState = "end"
    }
    if (frameCount % 1000 == 0) {
      stars();
    }
    if (monkey.isTouching(starGroup)) {
      starS.play();
      bonus = bonus + 20;
      starGroup.destroyEach();

    }
    if (bonus > 0 && frameCount % 30 == 0) {
      bScore.visible = true;
      bonus--
    }
    if (bonus == 0) {
      bScore.visible = false;
    }
    if ((monkey.isTouching(foodGroup)) && (bonus > 0)) {
      foodGroup.destroyEach();
      slurp.play();
      score = score + 5
    }
    if (bonus > 0 && frameCount % 100 == 0) {
      bananas();
    }
  }
  if (gameState == "end") {
    bg.velocityX = 0;
    monkey.velocityY = 0;
    monkey.visible = false;
    foodGroup.destroyEach();
    obstacleGroup.destroyEach();
    starGroup.destroyEach();
    
    gameOver.visible=true;
    restart.visible=true;
    
    if ((keyDown("R"))||mousePressedOver(restart)) {
      reset();
    }
  }

  drawSprites();
  fill(220);
  textSize(15);
  textFont("Hobo Std");
  text("Score- " + score, 530, 20);

  fill(220);
  textSize(15);
  textFont("Hobo Std");
  text("Injuries- " + injury, 518, 40);

  fill(220);
  textSize(15);
  textFont("Hobo Std");
  text("Bonus Time- " + bonus, 2, 20);
}

function obstacles() {
  obstacle = createSprite(640, 230, 10, 10);
  obstacle.velocityX = bg.velocityX
  obstacle.addImage(obstacleImage)
  obstacle.scale = 0.1;
  obstacle.lifetime = 220;
  obstacleGroup.add(obstacle);
  // obstacle.debug=true;
  obstacle.setCollider("circle", 0, 0, 120)
  monkey.depth = obstacle.depth + 1
}

function bananas() {
  banana = createSprite(640, round(random(120, 230)), 10, 10);
  banana.velocityX = bg.velocityX
  banana.addImage(bananaImage)
  banana.scale = 0.08;
  banana.lifetime = 220;
  foodGroup.add(banana);
}

function stars() {
  star = createSprite(640, round(random(120, 230)), 10, 10)
  star.addImage(starI);
  star.lifetime = 220;
  star.scale = 0.1
  star.velocityX = bg.velocityX - 1
  starGroup.add(star);
}

function reset() {
  injury = 0;
  score = 0;
  bonus = 0;
  gameOver.visible=false;
  restart.visible=false;
  gameState = "play"
}