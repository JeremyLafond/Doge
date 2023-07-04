/*,.-'`*`'-..,Jeremy Lafond 
Much Doge
Special thanks to:
Jonti Picking for "Doge Adventure", DogeSong.mp3 http://www.patreon.com/mrweebl
Eddy Wally the "Wow" guy(rip)
The creator of the doge meme
The creator of nyan cat
The creator of "80s text generator"
The creators of my various background/doge/hamburger sprites

*/

var game = new Phaser.Game(800, 450, Phaser.AUTO, "");
var highScore = 0;
var fx;
var music;

//preloader state and methods
var Preloader = function(game) {};
Preloader.prototype =
{
	preload: function()
	{
	//scaling for window
	game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
  game.scale.pageAlignVertically = true;
  game.scale.pageAlignHorizontally = true;
  game.scale.refresh();

    //dbg msg
	console.log('Preloader: preload');
	//load music
	game.load.audio('music', ['assets/DogeSong.mp3', 'assets/DogeSong.ogg']);
  game.load.audio('fx',['assets/wow.mp3', 'assets/wow.ogg']);
  },

	create: function() 
	{
		//dbg msg
		console.log('Preloader: create');
    //switch to Menu state from preload state
    music = game.add.audio('music', 0.7, true);
    music.play();
    fx = game.add.audio('fx', 1, false);
    game.sound.setDecodedCallback(['music', 'fx'], MainMenu, this);
		game.state.start('MainMenu')
	},

	update: function()
	{
		console.log('Updater: update');
	},
}

var MainMenu = function(game) {};
MainMenu.prototype =
{
	preload: function()
	{
		//dbg msg
		console.log('MainMenu: preload');
		//preload assets for menu
		game.load.image('dogemenu', 'assets/dogeback.png');
		game.load.image('sky', 'assets/Full.png');
    	game.load.spritesheet('dogedog', 'assets/dogey.png', 69, 70, 26);
    	game.load.image('ground', 'assets/Ground.png');
    	game.load.image('MuchDoge', 'assets/MuchDoge.png');
	},

	create: function ()
	{
		//autoscrolls sky background
    	var bg = game.add.tileSprite(0, 0, game.width, game.height, "sky");
    	bg.autoScroll(-125, 0);

    	//autoscrolls buildings to stand on
    	var tile = game.add.tileSprite(0, 350, game.width, game.height - 330, "ground");
    	tile.autoScroll(-300, 0);
    	//dbg msg
		console.log('MainMenu: create');
		//add menu text
		//var nameLabel = game.add.text(275, 100, 'Much Doge',
									//{ font: '50px Comic Sans', fill: '#800080' });
		much = game.add.sprite(255, 30, 'MuchDoge');


		var startLabel = game.add.text(80, game.world.height-150,
									 'press "W" to start',
									{ font: '25px Comic Sans', fill: '#800080' });

		var pressLabel = game.add.text(500, game.world.height-150, 'Press any button to Jump',
									{ font: '25px Comic Sans', fill: '#800080' });

		//doge menu icon
		doge = game.add.sprite(600, 0, 'dogemenu');
		game.add.sprite(30, 0, 'dogemenu');
		doge.scale.setTo(1,1);

		//doge animated character
		dog = game.add.sprite(290, 286, 'dogedog');
		dog.animations.add('run', [0, 1, 2, 3, 4, 5, 6, 7, 8], 30, true, true);
		dog.play('run');
		//makes doge slowly slide forward and back while running
    	game.add.tween(dog.position).to({x: 380}, 2500, Phaser.Easing.Sinusoidal.InOut, true, 0, 1000, true);

    	//displays highscore in menu
		if (highScore) {
      	var scoreText = game.add.text(0, 250, "HIGH SCORE " + highScore, {fill: "#800080", font: 30 + "px Comic Sans"});
      	scoreText.position.x = game.width / 2 - scoreText.width / 2;
      	}
	},

	update: function()
	{
    var holding_down = game.input.activePointer.isDown;
		if (game.input.keyboard.isDown(Phaser.Keyboard.W) || holding_down)
		{
			//switch to game state from menu if W is pressed
			game.state.start('Game');
		}
    
	},
}

var Game = function(game) {};
Game.prototype =
{
	preload: function() 
	{
	//dbg msg
	console.log('Game: preload');
	game.load.image('city', 'assets/city_3.png');
	game.load.spritesheet('dogedog', 'assets/dogey.png', 69, 70, 26);
	game.load.image('meat', 'assets/ratburger.png');
	game.load.image('wow', 'assets/wow.png');
	game.load.image('ground', 'assets/Ground.png');
	game.load.spritesheet('nyan', 'assets/nyan.png', 60, 30, 5);
	},

	create: function ()
	{
	
	//general speed of background
	gameSpeed = 650;

	//enable the universal Arcade Physics system
    game.physics.startSystem(Phaser.Physics.ARCADE);
    game.physics.arcade.gravity.y = 2500;
    game.physics.arcade.OVERLAP_BIAS = 30;

    game.stage.backgroundColor = "#facade";
    game.add.sprite(0, 0, 'city');

    //dbg msg
	console.log('Game: create');
	//adds various buildings to scroll to give paralax depth
	bgBuildings = game.add.tileSprite(0, 0, game.width, game.height, 'city');
    bgBuildings.autoScroll(-gameSpeed / 5.2, 0);

    buildings = game.add.group();

	//adds burgers to physics group and iterates number of burgers
	meats = game.add.group();
    for (var i = 0; i < 20; i ++) 
    {
      var meatNum = Math.floor(Math.random() * 3) + 1;
      var meat = game.add.sprite(0, 0, 'meat');
      game.physics.enable(meat, Phaser.Physics.ARCADE);
      meat.body.bounce.y = 1;
      meats.add(meat);
      meat.kill();
    }

    // draw score
    var scoreSize = 36;
   	score = 0;
    displayScore = 0;
    scoreText = game.add.text(game.width - 250, 15, "SCORE: " + displayScore, {fill: "#800080", font: scoreSize + "px Comic Sans"});
 
    //add dogedog into the mix
   	dog = game.add.sprite(290, 286, 'dogedog');
   	dog.animations.add('run', [0, 1, 2, 3, 4, 5, 6, 7, 8], 30, true, true);
   	dog.animations.play('run');

    game.physics.enable(dog, Phaser.Physics.ARCADE);
    dog.body.width = 69;
    dog.body.height = 70;
    dog.body.bounce.y = 0.35;

    //emits wows
   	wowEmitter = game.add.emitter(0, 0, 100);
    wowEmitter.makeParticles('wow');
    wowEmitter.gravity = -2500;
    wowEmitter.setRotation(0, 0);
    wowEmitter.setAlpha(0.95, 0.0, 2000);
    wowEmitter.setScale(0.75, 1, 0.75, 1);

    //master building function contains lots of different relationships to other objects
	makeBuilding = function(x, width, height, spawnMeats) 
	{
		var building = game.add.tileSprite(x, game.height - height, width * 63, height, 'ground');
    	game.physics.enable(building, Phaser.Physics.ARCADE);
    	building.body.allowGravity = false;
    	building.body.immovable = true;
    	building.body.width = width * 63;
    	building.body.height = 400;

    	building.update = function() 
    	{
      		if (building.body.position.x + building.body.width < 0) 
      		{
        	building.destroy();
      		}
    	};

    	if (spawnMeats) 
    	{
      		// place meatsrandomly above building
      		var numMeats = Math.floor(Math.random() * width / 2);
      		var meatLocations = [];
      		for (i = 1; i < width; i ++) 
      		{
        		if (Math.random() > 0.7) 
        		{
          		var meat = meats.getFirstExists(false);
          			if (meat) 
          			{
            		meat.reset(x + i * 63, game.height - height - 64);
          			}
        		}
        	}
     	}
      buildings.add(building);
    };
    //jump event that maintains number of jumps
    function jump(event) 
    {
      if (dogJumpCount) 
      {
        dogJumpCount --;
        dog.body.velocity.y = -1000;
      }      
    }

    game.input.onDown.add(jump);
    game.input.keyboard.onDownCallback = jump;

	makeBuilding(0, 25, 100, false);
    //the point doge tries to be at
    chaseX = 100;
    chaseAngle = 0;
    dogOnBuilding = false;
    //some nyan stuff that didn't work right
	nyans = game.add.group();
	nyans.enableBody = true;


    var nyan = nyans.create((game.width -100), 10, 'nyan');
    game.physics.enable(nyan, Phaser.Physics.ARCADE);

    nyan.body.width = 60;
    nyan.body.height = 30;
    nyan.body.velocity.x = -300;
    nyan.body.allowGravity = false;
    nyan.body.collideWorldBounds = true;
    nyan.body.bounce.setTo(.9,.9);

    
   	
    nyan.animations.add('flyan', [0, 1, 2, 3, 4], 15, true, true);
    nyan.animations.play('flyan');
    //game.physics.arcade.overlap(dog, nyans, collectCat, null, this);
},

update: function()
{
	//maintains jump count
	if (dogOnBuilding) 
	{
      dogOnBuilding = false;
      dogJumpCount = 1;

      // move back and forth towards the floating chase x point
      chaseAngle += 0.05;
      chaseX = 70 + Math.sin(chaseAngle) * 30;
      
      dog.body.position.x = chaseX;
    }

    gameSpeed += 0.1;

    var moveAmount = gameSpeed / 70;

    // loop over buildings
    // if the right of the last building is on the screen, then generate a new building
    var maxRight = 0;
    buildings.children.forEach(function(building) 
    {
      building.body.position.x -= moveAmount;

      if (building.body.right > maxRight) 
      {
        maxRight = building.body.right;
      }
    });

    if (maxRight < game.width) 
    {
      makeBuilding(game.width + gameSpeed * .5, Math.floor(Math.random() * 10) + 2, Math.floor(Math.random() * 300) + 30, true);
    }

    meats.children.forEach(function(meat) 
    {
      meat.body.position.x -= moveAmount;
    });

    game.physics.arcade.collide(dog, buildings, function(dog, building) 
    {
      dogOnBuilding = true;
      dog.body.position.x = chaseX;
    });

    game.physics.arcade.collide(buildings, meats);

    //doge and meat collide!
    game.physics.arcade.overlap(dog, meats, function(dog, meat) 
    {
      score += 100 + Math.floor(Math.random() * 100);
      fx.play();
      if (score > highScore) 
      {
        highScore = score;
      }
      
      // move emitter to meat location and burst wow text
      wowEmitter.x = meat.body.position.x;
      wowEmitter.y = meat.body.position.y;
      wowEmitter.start(true, 2000, null, 6);
      meat.kill();

    });

    // update score
    if (displayScore < score) 
    {
      var addAmount = Math.ceil((score - displayScore) / 8);
      displayScore += addAmount;
      scoreText.text = "SCORE: " + displayScore;
    }

	//if u fall too far, the game restarts from the menu
    if (dog.body.y > game.height) 
    {
      game.state.start("MainMenu");
    }	
},
};

/*function collectCat (dog, nyan) 
{
    // Removes the star from the screen
    nyan.kill();

    //  Add and update the score
    score += 500;
}*/

//states
game.state.add('Preloader', Preloader);
game.state.add('MainMenu', MainMenu);
game.state.add('Game', Game);
game.state.start('Preloader');