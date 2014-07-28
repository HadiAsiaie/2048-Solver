var socket_url= "http://localhost:8080";
var socket = io.connect('/');
function GameManager(size, InputManager, Actuator, StorageManager) {
  this.size           = size; // Size of the grid
  this.inputManager   = new InputManager;
  this.storageManager = new StorageManager;
  this.actuator       = new Actuator;
  this.cache          ={};
  this.running        =false;
  this.something_on_the_way=false;
  this.startTiles     = 2;
  this.all_states         =[];
  this.threshHold          =500;
  this.prev_touch_event    =0;
  this.goal                 =64;

  
  this.inputManager.on("move", this.move.bind(this));
  this.inputManager.on("restart", this.restart.bind(this));
  this.inputManager.on("hint", this.hint.bind(this));
  this.inputManager.on("undo", this.undo.bind(this));
  this.inputManager.on("solve", this.solve_main.bind(this));
  this.inputManager.on("keepPlaying", this.keepPlaying.bind(this));
  this.setup();
  var self=this;
    socket.on('connect', function () {
        console.log("2048 is connected");
        //socket.emit("2048", "give me a hint");
        socket.on('2048',function(data){
            data=JSON.parse(data);
            console.log("result came from server"+" "+data);
            var board_s=self.get_board();
            console.log('Board is '+board_s);
            var best=data[board_s];
            //var best=parseInt(data);
            console.log('best1 is '+best);
            best = [0, 2, 3, 1][best];
            console.log('best is '+best);
            self.move(best);
            self.something_on_the_way=false;
        });

    });
}


// Restart the game
GameManager.prototype.restart = function () {

  this.storageManager.clearGameState();
  this.actuator.continueGame(); // Clear the game won/lost message
  this.setup();

};



GameManager.prototype.get_board = function (){
var board_s="[";
     for (var y=0; y<4; y++) {
      for (var x=0; x<4; x++) {
        var cur=null;
        if (this.grid.cells[x][y]!=null) {
                var value = this.grid.cells[x][y].value;
                cur=value.toString();
        }
        else
           cur="0";
        board_s+=cur;
        if(4*y+x!=15)
            board_s+=", ";
        else
            board_s+="]";
      }
    }
    return board_s
};
GameManager.prototype.solve_main = function () {
    var d=new Date();
    var current_touch_event= d.getTime();
    if(current_touch_event-this.prev_touch_event<this.threshHold)
    {
        console.log("too soon brother");
        return;
    }
    this.prev_touch_event=current_touch_event;
    if(this.running)
    {
        this.actuator.setRunButton('Solve it');
        this.running=false;
    }
    else
    {
        this.running=true;
        this.actuator.setRunButton('Stop');
        this.solve();
    }
};
//solve the board
GameManager.prototype.solve = function () {
       if(!this.running)
            return;
      console.log(this.running);
      console.log(!this.over);


   var board_s=this.get_board();
    if(!this.something_on_the_way) {
        this.something_on_the_way=true;
        socket.emit("2048", board_s);
    }
   var timeout = 100;
    var self=this;
   if (this.running && !this.over) {
      setTimeout(function(){
        self.solve();
      }, timeout);
    }

};


// get hint from program
GameManager.prototype.hint = function () {
    var d=new Date();
    var current_touch_event= d.getTime();
    if(current_touch_event-this.prev_touch_event<this.threshHold)
    {
        console.log("too soon brother");
        return;
    }

    this.prev_touch_event=current_touch_event;
      if(this.running)
        return;
      var board_s=this.get_board();
      socket.emit("2048", board_s);
};

// Keep playing after winning (allows going over 2048)
GameManager.prototype.keepPlaying = function () {
  this.keepPlaying = true;
  this.actuator.continueGame(); // Clear the game won/lost message
};

// Return true if the game is lost, or has won and the user hasn't kept playing
GameManager.prototype.isGameTerminated = function () {
  if (this.over || (this.won && !this.keepPlaying)) {
    return true;
  } else {
    return false;
  }
};

GameManager.prototype.undo = function () {

    console.log("Hello");
    if(this.all_states.length>0)
    {
        last=this.all_states.length-1;
        my_state=this.all_states[last];
        this.grid        = new Grid(my_state.grid.size,
                                    my_state.grid.cells); // Reload grid
        this.score       = my_state.score;
        this.over        = my_state.over;
        this.won         = my_state.won;
        this.keepPlaying = my_state.keepPlaying;
        console.log("Hadi2 talking")
        console.log(this.score);
        this.all_states=this.all_states.slice(0,last-1);
        console.log("Trying undo");
        this.actuate();
    }

};

// Set up the game
GameManager.prototype.setup = function () {
  var previousState = this.storageManager.getGameState();

  // Reload the game from a previous game if present
  if (previousState) {
    this.grid        = new Grid(previousState.grid.size,
                                previousState.grid.cells); // Reload grid
    this.score       = previousState.score;
    this.over        = previousState.over;
    this.won         = previousState.won;
    this.keepPlaying = previousState.keepPlaying;
  } else {
    this.grid        = new Grid(this.size);
    this.score       = 0;
    this.over        = false;
    this.won         = false;
    this.keepPlaying = false;

    // Add the initial tiles
    this.addStartTiles();
  }

  // Update the actuator
  this.actuate();


};

// Set up the initial tiles to start the game with
GameManager.prototype.addStartTiles = function () {
  for (var i = 0; i < this.startTiles; i++) {
    this.addRandomTile();
  }
};

// Adds a tile in a random position
GameManager.prototype.addRandomTile = function () {
  if (this.grid.cellsAvailable()) {
    var value = Math.random() < 0.9 ? 2 : 4;
    var tile = new Tile(this.grid.randomAvailableCell(), value);

    this.grid.insertTile(tile);
  }
};

// Sends the updated grid to the actuator
GameManager.prototype.actuate = function () {
  if (this.storageManager.getBestScore() < this.score) {
    this.storageManager.setBestScore(this.score);
  }

  // Clear the state when the game is over (game over only, not win)
  if (this.over) {
    this.storageManager.clearGameState();
  } else {
    this.storageManager.setGameState(this.serialize());
  }

  this.actuator.actuate(this.grid, {
    score:      this.score,
    over:       this.over,
    won:        this.won,
    bestScore:  this.storageManager.getBestScore(),
    terminated: this.isGameTerminated()
  });

};

// Represent the current game as an object
GameManager.prototype.serialize = function () {
  return {
    grid:        this.grid.serialize(),
    score:       this.score,
    over:        this.over,
    won:         this.won,
    keepPlaying: this.keepPlaying
  };
};

// Save all tile positions and remove merger info
GameManager.prototype.prepareTiles = function () {
  this.grid.eachCell(function (x, y, tile) {
    if (tile) {
      tile.mergedFrom = null;
      tile.savePosition();
    }
  });
};

// Move a tile and its representation
GameManager.prototype.moveTile = function (tile, cell) {
  this.grid.cells[tile.x][tile.y] = null;
  this.grid.cells[cell.x][cell.y] = tile;
  tile.updatePosition(cell);
};

// Move tiles on the grid in the specified direction
GameManager.prototype.move = function (direction) {

    //just adding my thing here

    cur_state= {
                      grid:        this.grid.serialize(),
                      score:       this.score,
                      over:        this.over,
                      won:         this.won,
                      keepPlaying: this.keepPlaying
                    };

     this.all_states.push(cur_state);
     console.log("Saved the states");


  // 0: up, 1: right, 2: down, 3: left
  var self = this;

  if (this.isGameTerminated()) return; // Don't do anything if the game's over

  var cell, tile;

  var vector     = this.getVector(direction);
  var traversals = this.buildTraversals(vector);
  var moved      = false;

  // Save the current tile positions and remove merger information
  this.prepareTiles();

  // Traverse the grid in the right direction and move tiles
  traversals.x.forEach(function (x) {
    traversals.y.forEach(function (y) {
      cell = { x: x, y: y };
      tile = self.grid.cellContent(cell);

      if (tile) {
        var positions = self.findFarthestPosition(cell, vector);
        var next      = self.grid.cellContent(positions.next);

        // Only one merger per row traversal?
        if (next && next.value === tile.value && !next.mergedFrom) {
          var merged = new Tile(positions.next, tile.value * 2);
          merged.mergedFrom = [tile, next];

          self.grid.insertTile(merged);
          self.grid.removeTile(tile);

          // Converge the two tiles' positions
          tile.updatePosition(positions.next);

          // Update the score
          self.score += merged.value;

          // The mighty 2048 tile
          if (merged.value === 2048) self.won = true;
        } else {
          self.moveTile(tile, positions.farthest);
        }

        if (!self.positionsEqual(cell, tile)) {
          moved = true; // The tile moved from its original cell!
        }
      }
    });
  });

  if (moved) {
    this.addRandomTile();

    if (!this.movesAvailable()) {
      this.over = true; // Game over!
    }

    this.actuate();
  }
};

// Get the vector representing the chosen direction
GameManager.prototype.getVector = function (direction) {
  // Vectors representing tile movement
  var map = {
    0: { x: 0,  y: -1 }, // Up
    1: { x: 1,  y: 0 },  // Right
    2: { x: 0,  y: 1 },  // Down
    3: { x: -1, y: 0 }   // Left
  };

  return map[direction];
};

// Build a list of positions to traverse in the right order
GameManager.prototype.buildTraversals = function (vector) {
  var traversals = { x: [], y: [] };

  for (var pos = 0; pos < this.size; pos++) {
    traversals.x.push(pos);
    traversals.y.push(pos);
  }

  // Always traverse from the farthest cell in the chosen direction
  if (vector.x === 1) traversals.x = traversals.x.reverse();
  if (vector.y === 1) traversals.y = traversals.y.reverse();

  return traversals;
};

GameManager.prototype.findFarthestPosition = function (cell, vector) {
  var previous;

  // Progress towards the vector direction until an obstacle is found
  do {
    previous = cell;
    cell     = { x: previous.x + vector.x, y: previous.y + vector.y };
  } while (this.grid.withinBounds(cell) &&
           this.grid.cellAvailable(cell));

  return {
    farthest: previous,
    next: cell // Used to check if a merge is required
  };
};

GameManager.prototype.movesAvailable = function () {
  return this.grid.cellsAvailable() || this.tileMatchesAvailable();
};

// Check for available matches between tiles (more expensive check)
GameManager.prototype.tileMatchesAvailable = function () {
  var self = this;

  var tile;

  for (var x = 0; x < this.size; x++) {
    for (var y = 0; y < this.size; y++) {
      tile = this.grid.cellContent({ x: x, y: y });

      if (tile) {
        for (var direction = 0; direction < 4; direction++) {
          var vector = self.getVector(direction);
          var cell   = { x: x + vector.x, y: y + vector.y };

          var other  = self.grid.cellContent(cell);

          if (other && other.value === tile.value) {
            return true; // These two tiles can be merged
          }
        }
      }
    }
  }

  return false;
};

GameManager.prototype.positionsEqual = function (first, second) {
  return first.x === second.x && first.y === second.y;
};
