// Inits
window.onload = function init() {
    var game = new GF();
    game.start();
  };
  
  
  // GAME FRAMEWORK STARTS HERE
  var GF = function(){
      // Vars relative to the canvas
      var canvas, ctx, w, h; 
  
      // vars for counting frames/s, used by the measureFPS function
      var frameCount = 0;
      var lastTime;
      var fpsContainer;
      var fps; 

      var inputStates = {};
      // var timeSinceLastInput = 0;

      var grid = [];
      var gridSize = 10;
      var goal = 2048;

      function drawGrid(){
        size = w/gridSize;
        for (let i = 1; i < gridSize; i++) {
            ctx.beginPath();
            ctx.moveTo(size*i, 0);
            ctx.lineTo(size*i, h);
            ctx.stroke();
        }
        for (let i = 1; i < gridSize; i++) {
            ctx.beginPath();
            ctx.moveTo(0, size*i);
            ctx.lineTo(w, size*i);
            ctx.stroke();
        }
      }

      function getAvailableSquares(grid, gridSize){
        let availableSquares = []; 
        for (let x=0;x<gridSize;x++){
            for (let y=0;y<gridSize;y++){
                if (grid[x][y] == 0){
                    let pos = x.toString()+' '+y.toString();
                    availableSquares.push(pos);
                }
            }
        }
        return availableSquares;
      }

      function getRandomPosition(availabeSquares){
        if (!availabeSquares.length){
          return 0;
        }
        let code = availabeSquares[Math.floor(Math.random()*availabeSquares.length)];
        square = code.split(" ");
        var x = square[0];
        var y = square[1];
        return [x,y];
      }

      function createBlock(grid){
        let pos = getRandomPosition(getAvailableSquares(grid, gridSize));
        if (pos === 0){
          return 0;
        }
        grid[pos[0]][pos[1]] = 2;
      }

      function startGrid(grid, gridSize){

        for (let i = 0; i < gridSize; i++){
            line = [];
            for (let j = 0; j < gridSize; j++) {
                line.push(0);
            }
            grid.push(line);
        }
        for (let i = 0; i < 2; i++) {
            createBlock(grid);
            }
        }        

      function drawSquare(x,y){
        let gridX = (w/gridSize)*y;
        let gridY = (h/gridSize)*x;
        let sqHeight = h/gridSize;

        ctx.save();
        ctx.translate(gridX,gridY);
        // ctx.fillstyle = "#505050"
        // ctx.fillRect(0,0,sqHeight,sqHeight);

        ctx.strokeStyle = "black";
        ctx.font="60px Georgia";
        ctx.textAlign="center"; 
        ctx.textBaseline = "middle";
        ctx.fillText(grid[x][y], sqHeight/2,sqHeight/2);
        ctx.restore();
      }

      function drawGridValues(grid, gridSize){
        for (let x=0;x<gridSize;x++){
            for (let y=0;y<gridSize;y++){
                if (grid[x][y] != 0) {
                    drawSquare(x,y);
                }
            }
        }
      }
    
      var measureFPS = function(newTime){
        
           // test for the very first invocation
           if(lastTime === undefined) {
             lastTime = newTime; 
             return;
           }
        
          //calculate the difference between last & current frame
          var diffTime = newTime - lastTime; 
  
          if (diffTime >= 1000) {
              fps = frameCount;    
              frameCount = 0;
              lastTime = newTime;
          }
  
          //and display it in an element we appended to the 
          // document in the start() function
         fpsContainer.innerHTML = 'FPS: ' + fps; 
         frameCount++;
      };
    
       // clears the canvas content
       function clearGrid(gridSize) {
         ctx.clearRect(0, 0, w, h);
         drawGrid();
       }
    
       // Functions for drawing the monster and maybe other objects
       function drawMyMonster(x, y) {
         // draw a big monster !
         // head
     
         // save the context
         ctx.save();
    
         // translate the coordinate system, draw relative to it
         ctx.translate(x, y);
    
         // (0, 0) is the top left corner of the monster.
         ctx.strokeRect(0, 0, 100, 100);
    
         // eyes
         ctx.fillRect(20, 20, 10, 10);
         ctx.fillRect(65, 20, 10, 10);
    
         // nose
         ctx.strokeRect(45, 40, 10, 40);
    
         // mouth
         ctx.strokeRect(35, 84, 30, 10);
    
         // teeth
         ctx.fillRect(38, 84, 10, 10);
         ctx.fillRect(52, 84, 10, 10);
    
        // restore the context
        ctx.restore(); 
      }

      function move(grid, gridSize, direction){
        switch (direction){

          case "left":
            for (let x=0;x<gridSize;x++){
              for (let y=0;y<gridSize;y++){
                if (grid[x][y] != 0){
                  let i = y;
                  while (i>0){
                    if (grid[x][i-1] != 0){
                      break;
                    }
                    else{
                      let temp = grid[x][i-1];
                      grid[x][i-1] = grid[x][i];
                      grid[x][i] = temp;
                      i--;
                    }
                  }
                }
              }
            }
            break;

          case "up":
            for (let x=0;x<gridSize;x++){
              for (let y=0;y<gridSize;y++){
                if (grid[x][y] != 0){
                  let i = x;
                  while (i>0){
                    if (grid[i-1][y] != 0){
                      break;
                    }
                    else{
                      let temp = grid[i-1][y];
                      grid[i-1][y] = grid[i][y];
                      grid[i][y] = temp;
                      i--;
                    }
                  }
                }
              }
            }
            break;

          case "right":
            for (let x=gridSize-1;x>=0;x--){
              for (let y=gridSize-1;y>=0;y--){
                if (grid[x][y] != 0){
                  let i = y;
                  while (i<gridSize-1){
                    if (grid[x][i+1] != 0){
                      break;
                    }
                    else{
                      let temp = grid[x][i+1];
                      grid[x][i+1] = grid[x][i];
                      grid[x][i] = temp;
                      i++;
                    }
                  }
                }
              }
            }
            break;

          case "down":
            for (let x=gridSize-1;x>=0;x--){
              for (let y=gridSize-1;y>=0;y--){
                if (grid[x][y] != 0){
                  let i = x;
                  while (i<gridSize-1){
                    if (grid[i+1][y] != 0){
                      break;
                    }
                    else{
                      let temp = grid[i+1][y];
                      grid[i+1][y] = grid[i][y];
                      grid[i][y] = temp;
                      i++;
                    }
                  }
                }
              }
            }
            break;

        }
      }

      function combine(grid, gridSize, direction){

        switch (direction){

          case "left":
            for (let x=0;x<gridSize;x++){
              for (let y=1;y<gridSize;y++){
                if (grid[x][y] == grid[x][y-1]){
                  grid[x][y-1] *= 2;
                  grid[x][y] = 0;
                }
              }
            }
            break;

          case "up":
            for (let x=1;x<gridSize;x++){
              for (let y=0;y<gridSize;y++){
                if (grid[x][y] == grid[x-1][y]){
                  grid[x-1][y] *= 2;
                  grid[x][y] = 0;
                }
              }
            }
            break;

          case "right":
            for (let x=gridSize-1;x>=0;x--){
              for (let y=gridSize-2;y>=0;y--){
                if (grid[x][y] == grid[x][y+1]){
                  grid[x][y+1] *= 2;
                  grid[x][y] = 0;
                }
              }
            }
            break;

          case "down":
            for (let x=gridSize-2;x>=0;x--){
              for (let y=gridSize-1;y>=0;y--){
                if (grid[x][y] == grid[x+1][y]){
                  grid[x+1][y] *= 2;
                  grid[x][y] = 0;
                }
              }
            }
            break;

        }

      }

      function checkInputs(grid, gridSize, newTime){
        // if (newTime - timeSinceLastInput < 250){
        //   inputStates.left = false;
        //   inputStates.up = false;
        //   inputStates.right = false;
        //   inputStates.down = false;
        // }
        // else{
        //   timeSinceLastInput = newTime;
        // }

          if (inputStates.left) {
              move(grid, gridSize, 'left');
              combine(grid, gridSize, 'left');
              move(grid, gridSize, 'left');
              createBlock(grid);
              inputStates.left = false;
              }
          if (inputStates.up) {
                move(grid, gridSize, 'up');
                combine(grid, gridSize, 'up');  
                move(grid, gridSize, 'up');
                createBlock(grid);
                inputStates.up = false;
              }
          if (inputStates.right) {
                move(grid, gridSize, 'right');
                combine(grid, gridSize, 'right');
                move(grid, gridSize, 'right');
                createBlock(grid);
                inputStates.right = false;
              }
          if (inputStates.down) {
                move(grid, gridSize, 'down');
                combine(grid, gridSize, 'down');
                move(grid, gridSize, 'down');
                createBlock(grid);
                inputStates.down = false;
              }
      }

      function checkPossibleMoves(grid, gridSize){
        for (let x=0;x<gridSize;x++){
          for (let y=0;y<gridSize;y++){

            if (grid[x][y] == 0){
              return true;
            }
            // above
            if(x>0){
              if (grid[x][y] == grid[x-1][y]){
                return true;
            }}
            // below
            if(x<gridSize-1){
              if (grid[x][y] == grid[x+1][y]){
                return true;
            }}
            // left
            if(y>0){
              if (grid[x][y] == grid[x][y-1]){
                return true;
            }}
            // right
            if(x<gridSize-1){
              if (grid[x][y] == grid[x][y+1]){
                return true;
            }}

          }
        }
        return false;
      }

      function checkGameOver(grid, gridSize, goal){
        for (let x = 0; x < gridSize; x++) {
          for (let y = 0; y < gridSize; y++) {
            if (grid[x][y] >= goal){
              ctx.save();
              ctx.fillStyle = ctx.fillStyle = "rgba(255, 255, 0, 0.5)";
              ctx.fillRect(0,0,w,h);
              ctx.restore();
              return 1;
            }
          }
        }

        if (!checkPossibleMoves(grid, gridSize)){
          ctx.save();
          ctx.fillStyle = ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
          ctx.fillRect(0,0,w,h);
          ctx.restore();
          return 0;
        }
      }
    
      var mainLoop = function(time){

          //main function, called each frame 
          measureFPS(time);

          // check inputStates
          checkInputs(grid, gridSize, time);
        
          // Clear the grid
          clearGrid(gridSize);

          // Draw values
          drawGridValues(grid, gridSize);  

          // Check for game over
          checkGameOver(grid, gridSize, goal);
        
          // call the animation loop every 1/60th of second
          requestAnimationFrame(mainLoop);
      };
  
      var start = function(){
          // adds a div for displaying the fps value
          fpsContainer = document.createElement('div');
          document.body.appendChild(fpsContainer);
        
          // Canvas, context etc.
          canvas = document.querySelector("#myCanvas");
    
          // often useful
          w = canvas.width; 
          h = canvas.height;

          
    
          // important, we will draw with this object
          ctx = canvas.getContext('2d');

        // Add the listener to the main, window object, and update the states
        window.addEventListener('keydown', function(event){

            if (event.keyCode === 37) {
            inputStates.left = true;
            } else if (event.keyCode === 38) {
            inputStates.up = true;
            } else if (event.keyCode === 39) {
            inputStates.right = true;
            } else if (event.keyCode === 40) {
            inputStates.down = true;
            } else if (event.keyCode === 32) {
            inputStates.space = true;
            } 

            window.onkeydown = null;

        }, false);
        // If the key is released, change the states object
        window.addEventListener('keyup', function(event){
            if (event.keyCode === 37) {
            inputStates.left = false;
            } else if (event.keyCode === 38) {
            inputStates.up = false;
            } else if (event.keyCode === 39) {
            inputStates.right = false;
            } else if (event.keyCode === 40) {
            inputStates.down = false;
            } else if (event.keyCode === 32) {
            inputStates.space = false;
            }

            window.addEventListener('keydown', function(event){

              if (event.keyCode === 37) {
              inputStates.left = true;
              } else if (event.keyCode === 38) {
              inputStates.up = true;
              } else if (event.keyCode === 39) {
              inputStates.right = true;
              } else if (event.keyCode === 40) {
              inputStates.down = true;
              } else if (event.keyCode === 32) {
              inputStates.space = true;
              } else {
                return 0;
              }
  
              window.onkeydown = null;
  
          }, false);

        }, false);
    
  
          startGrid(grid,gridSize);
          console.log(grid);

          // start the animation
          requestAnimationFrame(mainLoop);
      };
  
      //our GameFramework returns a public API visible from outside its scope
      return {
          start: start
      };
  };