/*

The Game Project 6 - Game Mechanics

*/

var gameChar_x;
var gameChar_y;
var floorPos_y;
var scrollPos;
var gameChar_world_x;
var trees_x;
var mountains;
var clouds;
var collectables;
var canyons;


var isLeft;
var isRight;
var isFalling;
var isPlummeting;

var game_score;
var flagpole;
var lives;
var enemies;

function setup()
{
	createCanvas(1024, 576);
	floorPos_y = height * 3/4;
    lives = 4;
    startGame();
}

function startGame()
{
    gameChar_x = width/2;
	gameChar_y = floorPos_y;

	// Variable to control the background scrolling.
	scrollPos = 0;

	// Variable to store the real position of the gameChar in the game
	// world. Needed for collision detection.
	gameChar_world_x = gameChar_x - scrollPos;

	// Boolean variables to control the movement of the game character.
	isLeft = false;
	isRight = false;
	isFalling = false;
	isPlummeting = false;

//Initialise arrays of scenery objects.
trees_x = [100, 550, 1050, 2050,  1450];

mountains = [{x: 2, y: 400, size: 50}];
  
clouds = [{y: 0, width: 50},
          100, 500, 900];

collectables = [{x_pos:200, y_pos: 405, size: 50},
                {x_pos:900, y_pos: 405, size: 50},
                {x_pos:1500, y_pos: 405, size: 50}];

canyons = [{x_pos: 300,width: 100},
           {x_pos: 600,width: 100},
           {x_pos: 1000,width: 100}];

game_score = 0;
flagpole = {x_pos: 2500, isReached: false};

lives -= 1;
    
enemies = [];
    
enemies.push(new Enemy(150, floorPos_y, 100));
enemies.push(new Enemy(850, floorPos_y, 100));
enemies.push(new Enemy(1450, floorPos_y, 100));
}

function draw()
{
	background(100, 155, 255); // fill the sky blue
	noStroke();
	fill(0,155,0);
	rect(0, floorPos_y, width, height/4); // draw some green ground

push();
translate(scrollPos, 0);

drawClouds();
drawMountains();
drawTrees();

    

	// Draw canyons.
for(var i = 0; i < canyons.length; i++)
{
    drawCanyon(canyons[i]); 
    checkCanyon(canyons[i]);
}

	// Draw collectable items.
for (var i = 0; i < collectables.length; i++)
{   

    if(!collectables[i].isFound)
    {
        drawCollectable(collectables[i]);    
        checkCollectable(collectables[i]);    
    }
    
} 

renderFlagpole();
    
for (var i = 0; i < enemies.length; i++)
{
    enemies[i].update();
    enemies[i].draw();
   
    if(enemies[i].isContact(gameChar_world_x,gameChar_y))
        {
            startGame();
            break;
        }
}    

pop();
    
// Draw game character.
	
drawGameChar();

//draw screen text
    
fill(255);
noStroke();
textSize(25)
text("score: " + game_score, 10, 540);


fill(255);
noStroke();
textSize(25)
text("lives: " + lives, 500, 540);

if(lives < 1)
{
    fill(255);
    noStroke();
    textSize(25)
    text("GAME OVER. Press space to continue.", height/2, width/2);
    return;
}

if(flagpole.isReached)
{
    fill(255);
    noStroke();
    textSize(25)
    text("LEVEL COMPLETE. Press space to continue.", height/2, width/2)
    return;
}
    
    // Logic to make the game character move or the background scroll.

    
if(isLeft)
{
		if(gameChar_x > width * 0.2)
		{
            gameChar_x -= 5;
		}
		else
		{
			scrollPos += 5;
		}
	}

if(isRight)
{
		if(gameChar_x < width * 0.8)
		{
			gameChar_x  += 5;
		}
		else
		{
			scrollPos -= 5; // negative for moving against the background
		}
 
    }
 

// Logic to make the game character rise and fall.

if(gameChar_y >= floorPos_y && isPlummeting)
    {
        gameChar_y -= 100; 
    }

//gravity code
  
if(gameChar_y < floorPos_y)
{
        gameChar_y += 2;
        isFalling = true;
}else
    {
        isFalling = false;    
    }
    
    if(isPlummeting)
    {
        gameChar_y+=5;    
    }

 
if(flagpole.isReached != true)
    {
    checkFlagpole();
    }
    
if(gameChar_y > floorPos_y+50)
    {
        console.log("dead");
        startGame();  
    }
    
    
    // Update real position of gameChar for collision detection.
	gameChar_world_x = gameChar_x - scrollPos;
}



// ---------------------
// Key control functions
// ---------------------

function keyPressed(){
if(flagpole.isReached && key == ' ')
    {
    nextLevel();
    return;
    }
else if(lives == 0 && key == ' ')
    {
    returnToStart();
    return;
    }


if(keyCode == 37)
    {
        isLeft = true;
    }

if(keyCode == 39)
    {
        isRight = true;
    }
    

if(key == " ")
    {
     isPlummeting = true;
    }

}

function keyReleased()
{

if(keyCode == 37)
    {
        isLeft = false;
    }
    
if(keyCode == 39)
    {
        isRight = false;
    }

if(key == " ")
    {
    isPlummeting = false;
    }
    
}




// ------------------------------
// Game character render function
// ------------------------------

// Function to draw the game character.

function drawGameChar()
{

if(isLeft && isFalling)
	{
//		// add your jumping-left code
stroke(0)
  
////body
        fill(255, 100, 255)    
rect(gameChar_x, gameChar_y - 50, 20, 50);

////head
        fill(255)
ellipse(gameChar_x + 15, gameChar_y - 70, 40, 50)

////mouth
        fill(0)
ellipse(gameChar_x + 10, gameChar_y  - 58, 30, 25)
        
////teeth
        fill(255)
rect(gameChar_x, gameChar_y - 58, 20, 5)

////nose
        fill(255, 0, 0)
rect(gameChar_x, gameChar_y - 65, 20, 10)

////eyes
        fill(0)
ellipse(gameChar_x, gameChar_y - 75, 5, 5)
ellipse(gameChar_x + 20, gameChar_y - 75, 5, 5)


}else if(isRight && isFalling)
{
stroke(0)
 
////body
        fill(255, 100, 255)    
rect(gameChar_x - 15, gameChar_y - 50, 20, 50);

////head
        fill(255)
ellipse(gameChar_x - 15, gameChar_y - 70, 40, 50)

////mouth
        fill(0)
ellipse(gameChar_x - 10, gameChar_y  - 58, 30, 25)
    
////teeth
        fill(255)
rect(gameChar_x - 15, gameChar_y - 58, 20, 5)
    
////nose
        fill(255, 0, 0)
rect(gameChar_x - 15, gameChar_y - 65, 20, 10)
    
////eyes
        fill(0)
ellipse(gameChar_x, gameChar_y - 75, 5, 5)
ellipse(gameChar_x - 20, gameChar_y - 75, 5, 5)

}else if(isLeft)
{

//// add your walking left code
stroke(0)
  
////body
        fill(255, 100, 255)    
rect(gameChar_x, gameChar_y - 50, 20, 50);

////head
        fill(255)
ellipse(gameChar_x + 15, gameChar_y - 70, 40, 50)

////mouth
        fill(0)
ellipse(gameChar_x + 10, gameChar_y  - 58, 30, 25)

////teeth
        fill(255)
rect(gameChar_x, gameChar_y - 58, 20, 5)
    
////nose
        fill(255, 0, 0)
rect(gameChar_x, gameChar_y - 65, 20, 10)
    
////eyes
        fill(0)
ellipse(gameChar_x, gameChar_y - 75, 5, 5)
ellipse(gameChar_x + 20, gameChar_y - 75, 5, 5)
       
}else if(isRight)
	{
//		// add your walking right code
 
////body
        fill(255, 100, 255)    
rect(gameChar_x, gameChar_y - 50, 20, 50);

////head
        fill(255)
ellipse(gameChar_x + 5, gameChar_y - 70, 40, 50)

////mouth
        fill(0)
ellipse(gameChar_x + 10, gameChar_y  - 58, 30, 25)

////teeth
        fill(255)
rect(gameChar_x, gameChar_y - 58, 20, 5)

////nose
        fill(255, 0, 0)
rect(gameChar_x, gameChar_y - 65, 20, 10)

////eyes
        fill(0)
ellipse(gameChar_x, gameChar_y - 75, 5, 5)
ellipse(gameChar_x + 20, gameChar_y - 75, 5, 5)

}
   else if(isFalling || isPlummeting)
	{
		// add your jumping facing forwards code  
 
//body
        fill(255, 100, 255)    
rect(gameChar_x - 15, gameChar_y - 55, 20, 50);

//head
        fill(255)
ellipse(gameChar_x, gameChar_y - 75, 40, 50)

////mouth
        fill(0)
ellipse(gameChar_x, gameChar_y - 68, 30, 25)

////teeth
        fill(255)
rect(gameChar_x - 10, gameChar_y - 68, 20, 5)

        
////nose
        fill(255, 0, 0)
rect(gameChar_x - 10, gameChar_y - 75, 20, 10)

////eyes
        fill(0)
ellipse(gameChar_x - 10, gameChar_y - 85, 5, 5)
ellipse(gameChar_x + 10, gameChar_y - 85, 5, 5)

}else{ 
       // add your standing front facing code
 
////body
    fill(255, 100, 255)    
rect(gameChar_x, gameChar_y - 50, 20, 50);

////head
    fill(255)
ellipse(gameChar_x + 10, gameChar_y - 70, 40, 50)

////mouth
    fill(0)
ellipse(gameChar_x + 10, gameChar_y  - 58, 30, 25)

////teeth
    fill(255)
rect(gameChar_x, gameChar_y - 58, 20, 5)

////nose
    fill(255, 0, 0)
rect(gameChar_x, gameChar_y - 65, 20, 10)

////eyes
    fill(0)
ellipse(gameChar_x, gameChar_y - 75, 5, 5)
ellipse(gameChar_x + 20, gameChar_y - 75, 5, 5)   
    }
}

// ---------------------------
// Background render functions
// ---------------------------

// Function to draw cloud objects.
function drawClouds()
{
for(var i = 0; i < clouds.length; i++)
    {
    fill(255, 255, 255, 235);
    ellipse(clouds[i], clouds[0].y + 50, clouds[0].width + 90, 100);
    ellipse(clouds[i] + 100, clouds[0].y + 100, clouds[0].width + 150, 100);
    ellipse(clouds[i] +150, clouds[0].y + 90, clouds[0].width + 100, 100);
    } 
}

// Function to draw mountains objects.
function drawMountains()
{
  for(var i = 0; i < mountains.length; i++)
    {
 push()
translate(450, 35)
 //mountain  
  noStroke()
  fill(130);
  triangle(mountains[i].x, mountains[i].y, 200, 150, 397, mountains[i].y);
        
//mountain peek
  noStroke()
  fill(245,248,240);
quad(143,220,200,150,250,210,200,190);
    pop();
    }

}

// Function to draw trees objects.

function drawTrees()
{
for(var i = 0; i < trees_x.length; i++)
    {
    fill(160,82,45)
    rect(trees_x[i] - 25, floorPos_y - 150, 50, 150)
    //head
    fill(0, 100, 0)    
    triangle(trees_x[i] - 75, floorPos_y  - 150, trees_x[i], floorPos_y - 300, trees_x[i]  + 75, floorPos_y - 150);
    }

}



// ---------------------------------
// Canyon render and check functions
// ---------------------------------

// Function to draw canyon objects.

function drawCanyon(t_canyon)
{
    fill(0, 0, 255);
    rect(t_canyon.x_pos, floorPos_y, t_canyon.width, height - floorPos_y); 
}

// Function to check character is over a canyon.

function checkCanyon(t_canyon)
{
if(gameChar_world_x > t_canyon.x_pos && gameChar_world_x < t_canyon.x_pos + t_canyon.width && gameChar_y >= floorPos_y)
    {
        gameChar_y += 5;
    }
}


function renderFlagpole(){
push();
stroke(250);
strokeWeight(5);
line(flagpole.x_pos, floorPos_y, flagpole.x_pos, floorPos_y-200);

if(flagpole.isReached)
    {
        noStroke();
        fill(255, 0, 0)
        rect(flagpole.x_pos, floorPos_y - 200, 50, 50)
    }else
    {
        noStroke();
        fill(255, 0, 0)
        rect(flagpole.x_pos, floorPos_y - 50, 50, 50)
    }
    pop();
}

function checkFlagpole()
{

var d = abs(gameChar_world_x - flagpole.x_pos);
    if(d < 50)
    {
        flagpole.isReached = true;    
    }
}



// ----------------------------------
// Collectable items render and check functions
// ----------------------------------

// Function to draw collectable objects.

function drawCollectable(t_collectable)
{

    fill(128, 0, 128)
stroke(255, 0, 0)
ellipse(t_collectable.x_pos, t_collectable.y_pos, t_collectable.size + 10)

    fill(0, 255, 255)
stroke(255, 255,0)
ellipse(t_collectable.x_pos, t_collectable.y_pos + 5, t_collectable.size - 60);

    fill(0, 255, 255)
stroke(255, 255,0)
ellipse(t_collectable.x_pos - 10, t_collectable.y_pos - 10, t_collectable.size - 60);
    
    fill(0, 255, 255)
stroke(255, 255,0)
ellipse(t_collectable.x_pos + 10, t_collectable.y_pos - 10, t_collectable.size - 60);

}

// Function to check character has collected an item.

function checkCollectable(t_collectable)
{
    
if(dist(gameChar_world_x, gameChar_y, t_collectable.x_pos, t_collectable.y_pos) < t_collectable.size)
    {
        t_collectable.isFound = true;
        game_score += 1;
    }
}

function Enemy(x, y, range)
{
    this.x = x;
    this.y = y;
    this.range = range;
    this.current_x = x;
    this.incr = 1;
    
    this.draw = function()
    {
        fill(0);
        ellipse(this.current_x, this.y - 25, 50);
        fill(255);
        ellipse(this.current_x - 5, this.y - 25, 5);
        ellipse(this.current_x + 5, this.y - 25, 5);
        
    }
    
    this.update = function()
    {
        this.current_x += this.incr;
    
        if(this.current_x < this.x)
        {
        this.incr = 1;    
        }else if (this.current_x > this.x + this.range)
        {
            this.incr = -1;
        }
    }
    this.isContact = function(gc_x, gc_y)
    {
        //returns true if contact is made
        
        var d = dist(gc_x, gc_y, this.current_x, this.y)
        
        if(d < 25)
        {
        return true;    
        }
        
        return false;
    }
}