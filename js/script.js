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
      var prevGrid = [];
      var blocks =[];
      var gridSize = 4;
      var goal = 2048;
      var animateDirection = 'none';
      var frame;

      function drawGrid(){
        ctx.save();
        ctx.strokeStyle = "rgb(108, 40, 141)";
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
        ctx.restore();
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

      class Block{
        constructor(x,y, value){
          this.x = x;
          this.y = y;
          this.value = value;
        }
      }

      function createBlock(grid, blocks){
        let pos = getRandomPosition(getAvailableSquares(grid, gridSize));
        if (pos === 0){
          return 0;
        }

        let valueList = [];
          for (let i=0;i<100; i++) {
            if (i<75){
              valueList.push(2);
            }
            else if (i<93){
              valueList.push(4);
            }
            else if (i<98){
              valueList.push(8);
            }
            else{
              valueList.push(16);
            }
          }
        let value = valueList[Math.floor(Math.random()*valueList.length)]

        grid[pos[0]][pos[1]] = value;
        blocks.push(new Block(pos[0], pos[1], value));
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
            createBlock(grid, blocks);
            }

          prevGrid = copyGrid(grid, gridSize);

        }        

      function drawSquare(x,y){

        let colors = ["D38FAB", "BF81A9", "AC72A6", "9864A4", "8556A1", "71489F", "5D399C", "4A2B9A", "361D97", "230E95", "0F0092"];
        let color;
        switch(grid[x][y]){
          case 2:
            color = colors[0];
            break;
          
          case 4:
            color = colors[1];
            break;
            
          case 8:
            color = colors[2];
            break;
              
          case 16:
            color = colors[3];
            break;
                
          case 32:
            color = colors[4];
            break;
                  
          case 64:
            color = colors[5];
            break;
                    
          case 128:
            color = colors[6];
            break;
                      
          case 256:
            color = colors[7];
            break;
                        
          case 512:
            color = colors[8];
            break;
                          
          case 1024:
            color = colors[9];
            break;
                            
          case 2048:
            color = colors[10];
            break;
                              
                                                                                                                        
        }

        let gridX = (w/gridSize)*y;
        let gridY = (h/gridSize)*x;
        let sqHeight = h/gridSize;

        ctx.save();
        ctx.translate(gridX,gridY);
        ctx.fillStyle = '#'+color;
        ctx.fillRect(0,0,sqHeight,sqHeight);
        ctx.restore();

        ctx.save();
        ctx.strokeStyle = "black";
        ctx.font="60px Georgia";
        ctx.textAlign="center"; 
        ctx.textBaseline = "middle";
        ctx.translate(gridX,gridY);
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

      // function drawGridValues(blocks){
      //   for (let i=0;i<blocks.lenght;i++){
      //     let block = blocks[i];
      //     drawSquare(block.x,block.y);
      //   }
      // }
    
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
        //  drawGrid();
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

      function animateMove(grid, gridSize, direction, frame){

        let colors = ["D38FAB", "BF81A9", "AC72A6", "9864A4", "8556A1", "71489F", "5D399C", "4A2B9A", "361D97", "230E95", "0F0092"];
        let color;
        let positions = [];

        // get positions with number cells

        for (let x=0;x<gridSize;x++){
          for (let y=0;y<gridSize;y++){
            switch (grid[x][y]){

              case 0:
                break;

              case 2:
                color = colors[0];
                positions.push([((w/gridSize)*x),((h/gridSize)*y),color,grid[x][y]]);
                break;
              
              case 4:
                color = colors[1];
                positions.push([((w/gridSize)*x),((h/gridSize)*y),color,grid[x][y]]);
                break;
                
              case 8:
                color = colors[2];
                positions.push([((w/gridSize)*x),((h/gridSize)*y),color,grid[x][y]]);
                break;
                  
              case 16:
                color = colors[3];
                positions.push([((w/gridSize)*x),((h/gridSize)*y),color,grid[x][y]]);
                break;
                    
              case 32:
                color = colors[4];
                positions.push([((w/gridSize)*x),((h/gridSize)*y),color,grid[x][y]]);
                break;
                      
              case 64:
                color = colors[5];
                positions.push([((w/gridSize)*x),((h/gridSize)*y),color,grid[x][y]]);
                break;
                        
              case 128:
                color = colors[6];
                positions.push([((w/gridSize)*x),((h/gridSize)*y),color,grid[x][y]]);
                break;
                          
              case 256:
                color = colors[7];
                positions.push([((w/gridSize)*x),((h/gridSize)*y),color,grid[x][y]]);
                break;
                            
              case 512:
                color = colors[8];
                positions.push([((w/gridSize)*x),((h/gridSize)*y),color,grid[x][y]]);
                break;
                              
              case 1024:
                color = colors[9];
                positions.push([((w/gridSize)*x),((h/gridSize)*y),color,grid[x][y]]);
                break;
                                
              case 2048:
                color = colors[10];
                positions.push([((w/gridSize)*x),((h/gridSize)*y),color,grid[x][y]]);
                break;
            } 
          }
        }

        // run animation
        moveAnimation(grid,gridSize,direction,positions,frame);
        }

      function moveAnimation(grid, gridSize, direction, positions,frame){
        // console.log(positions);
        let sqWidth = w/gridSize;
        let sqHeight = h/gridSize;
        // console.log(positions)

          clearGrid(gridSize);
          // drawGridValues(grid, gridSize);
          drawGrid();

          for (let block=0;block<positions.length;block++){
            
            positions[block][0] += ((w-positions[block][0])/10)*frame;
            
            ctx.save();
            ctx.translate(positions[block][0],positions[block][1]);
            ctx.fillStyle = "#"+positions[block][2];
            ctx.fillRect(0, 0, sqWidth,sqHeight);
            ctx.restore();

            ctx.save();
            ctx.translate(positions[block][0],positions[block][1]);
            ctx.strokeStyle = "black";
            ctx.font="60px Georgia";
            ctx.textAlign="center"; 
            ctx.textBaseline = "middle";
            ctx.fillText(positions[block][3], sqHeight/2,sqHeight/2);
            ctx.restore();

            ctx.restore();
          }
      }

      function move(grid, gridSize, direction, updateGrid){

        if (updateGrid){
          prevGrid = copyGrid(grid,gridSize);
        }

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
              move(grid, gridSize, 'left', true);
              combine(grid, gridSize, 'left');
              move(grid, gridSize, 'left',false);
              animateDirection = 'left';
              createBlock(grid,blocks);
              inputStates.left = false;
              }
          if (inputStates.up) {
                move(grid, gridSize, 'up',true);
                combine(grid, gridSize, 'up');  
                move(grid, gridSize, 'up',false);
                animateDirection = 'up';
                createBlock(grid,blocks);
                inputStates.up = false;
              }
          if (inputStates.right) {
                move(grid, gridSize, 'right',true);
                combine(grid, gridSize, 'right');
                move(grid, gridSize, 'right',false);
                animateDirection = 'right';
                createBlock(grid,blocks);
                inputStates.right = false;
              }
          if (inputStates.down) {
                move(grid, gridSize, 'down',true);
                combine(grid, gridSize, 'down');
                move(grid, gridSize, 'down',false);
                animateDirection = 'down';
                createBlock(grid,blocks);
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

      function copyGrid(grid,gridSize){
        var copy = []

        for (let x = 0; x < gridSize; x++) {
          copy.push([]);
          for (let y = 0; y < gridSize; y++) {
            copy[x].push(grid[x][y]);
            
          } 
        }
        return copy;
      }
    
      var mainLoop = function(time){

        if (frame >= 10){
          animateDirection = 'none';
        }

          //main function, called each frame 
          // measureFPS(time);

          // check inputStates
          checkInputs(grid, gridSize, time);

          if (animateDirection == 'none'){
            
            frame = 1;
            // Clear the grid
            clearGrid(gridSize);
            
            // Draw values
            drawGridValues(grid, gridSize);
            // drawGridValues(blocks);
            
            drawGrid();
            
            // Check for game over
            checkGameOver(grid, gridSize, goal);
          }

            else{

              console.log(grid);
              console.log(prevGrid);
              animateMove(grid,gridSize,animateDirection,frame);
              frame++;
          }

            
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
    
  
          startGrid(grid,gridSize, prevGrid);
          console.log(grid);
          console.log(prevGrid);

          // start the animation
          requestAnimationFrame(mainLoop);
      };
  
      //our GameFramework returns a public API visible from outside its scope
      return {
          start: start
      };
  };