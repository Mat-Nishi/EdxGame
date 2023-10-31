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
      var setUp = true;
      var drawEnd = true;

      var inputStates = {};
      // var timeSinceLastInput = 0;
      var gameState = 'menu';

      var grid = [];
      var prevGrid = [];
      var animationGrid = [];
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

      function startGrid(gridSize){
        grid = [];

        for (let i = 0; i < gridSize; i++){
            line = [];
            line2 = [];
            for (let j = 0; j < gridSize; j++) {
                line.push(0);
                line2.push(0);
            }
            grid.push(line);
            animationGrid.push(line2);
        }
        for (let i = 0; i < 2; i++) {
            createBlock(grid, blocks);
            }

          prevGrid = copyGrid(grid, gridSize);

        }        

      function drawSquare(x,y, drawNumbers){

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

        if (drawNumbers){
          ctx.save();
          ctx.strokeStyle = "black";
          ctx.font="55px Monospace";
          if (gridSize > 5){
            ctx.font="35px Monospace";
          }
          ctx.textAlign="center"; 
          ctx.textBaseline = "middle";
          ctx.translate(gridX,gridY);
          ctx.fillText(grid[x][y], sqHeight/2,sqHeight/2);
          ctx.restore();
        }
      }

      function drawGridValues(grid, gridSize, drawNumbers){
        for (let x=0;x<gridSize;x++){
            for (let y=0;y<gridSize;y++){
                if (grid[x][y] != 0) {
                    drawSquare(x,y,drawNumbers);
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

      function animateMove(grid, gridSize, direction, frame, updateFlag){

        if (updateFlag){
          updateAnimationGrid(grid,gridSize,direction);
        }

        let colors = ["D38FAB", "BF81A9", "AC72A6", "9864A4", "8556A1", "71489F", "5D399C", "4A2B9A", "361D97", "230E95", "0F0092"];
        let color;
        let increment;
        let draw;
        let positions = [];
        let sqWidth = w/gridSize;
        let sqHeight = h/gridSize;

        // get positions with number cells

        clearGrid(gridSize);

        for (let x=0;x<gridSize;x++){
          for (let y=0;y<gridSize;y++){

            draw = true;
            switch (prevGrid[x][y]){

              case 0:
                draw = false
                break;

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

            if (draw){

              increment = ((animationGrid[x][y]*sqWidth)/7)*frame;

              switch (direction){

                case 'up':
                  
                  ctx.save();
                  ctx.translate(y*sqWidth, (x*sqWidth)-increment);
                  ctx.fillStyle = "#"+color;
                  ctx.fillRect(0, 0, sqWidth,sqHeight);
                  ctx.restore();
                  
                  ctx.save();
                  ctx.translate(y*sqWidth, (x*sqWidth)-increment);
                  ctx.strokeStyle = "black";
                  ctx.font="55px Monospace";
                  if (gridSize > 5){
                    ctx.font="35px Monospace";
                  }
                  ctx.textAlign="center"; 
                  ctx.textBaseline = "middle";
                  ctx.fillText(prevGrid[x][y], sqHeight/2,sqHeight/2);
                  ctx.restore();
                  break;

                case 'right':
                  
                  ctx.save();
                  ctx.translate((y*sqWidth)+increment, x*sqWidth);
                  ctx.fillStyle = "#"+color;
                  ctx.fillRect(0, 0, sqWidth,sqHeight);
                  ctx.restore();
                  
                  ctx.save();
                  ctx.translate((y*sqWidth)+increment, x*sqWidth);
                  ctx.strokeStyle = "black";
                  ctx.font="55px Monospace";
                  if (gridSize > 5){
                    ctx.font="35px Monospace";
                  }
                  ctx.textAlign="center"; 
                  ctx.textBaseline = "middle";
                  ctx.fillText(prevGrid[x][y], sqHeight/2,sqHeight/2);
                  ctx.restore();
                  break;

                  case 'left':
                    
                    ctx.save();
                    ctx.translate((y*sqWidth)-increment, x*sqWidth);
                    ctx.fillStyle = "#"+color;
                    ctx.fillRect(0, 0, sqWidth,sqHeight);
                    ctx.restore();
                    
                    ctx.save();
                    ctx.translate((y*sqWidth)-increment, x*sqWidth);
                    ctx.strokeStyle = "black";
                    ctx.font="55px Monospace";
                    if (gridSize > 5){
                      ctx.font="35px Monospace";
                    }
                    ctx.textAlign="center"; 
                    ctx.textBaseline = "middle";
                    ctx.fillText(prevGrid[x][y], sqHeight/2,sqHeight/2);
                    ctx.restore();
                    break;

                    case 'down':
                      
                      ctx.save();
                      ctx.translate(y*sqWidth, (x*sqWidth)+increment);
                      ctx.fillStyle = "#"+color;
                      ctx.fillRect(0, 0, sqWidth,sqHeight);
                      ctx.restore();
                      
                      ctx.save();
                      ctx.translate(y*sqWidth, (x*sqWidth)+increment);
                      ctx.strokeStyle = "black";
                      ctx.font="55px Monospace";
                      if (gridSize > 5){
                        ctx.font="35px Monospace";
                      }
                      ctx.textAlign="center"; 
                      ctx.textBaseline = "middle";
                      ctx.fillText(prevGrid[x][y], sqHeight/2,sqHeight/2);
                      ctx.restore();
                      break;

              }
            }

          }
        }

        drawGrid();
        }


      function updateAnimationGrid(grid, gridSize, direction){

        for (let x=0;x<gridSize;x++){
          for (let y=0;y<gridSize;y++){
            animationGrid[x][y] = 0;
          }
        }

        switch(direction){

          case 'right':
            for (x=0;x<gridSize;x++){
              for (y=1;y<gridSize;y++){
                if (prevGrid[x][y] == 0){
                  for (let i=0;i<y;i++){
                    animationGrid[x][i]++;
                  }
                }
              }
            }
            break;
          
          case 'left':
            for (x=0;x<gridSize;x++){
              for (y=gridSize-2;y>=0;y--){
                if (prevGrid[x][y] == 0){
                  for (let i=gridSize-1;i>y;i--){
                    animationGrid[x][i]++;
                  }
                }
              }
            }
            break;

            case 'down':
              for (x=1;x<gridSize;x++){
                for (y=0;y<gridSize;y++){
                  if (prevGrid[x][y] == 0){
                    for (let i=0;i<=x;i++){
                      animationGrid[i][y]++;
                    }
                  }
                }
              }
              break;

              case 'up':
                for (x=gridSize-2;x>=0;x--){
                  for (y=0;y<gridSize;y++){
                    if (prevGrid[x][y] == 0){
                      for (let i=gridSize-1;i>x;i--){
                        animationGrid[i][y]++;
                      }
                    }
                  }
                }
                break;

        }

        for (let x=0;x<gridSize;x++){
          for (let y=0;y<gridSize;y++){
            if (prevGrid[x][y] == 0){
              animationGrid[x][y] = 0;
            }
          }
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
              inputStates.left = false;
              }
          if (inputStates.up) {
                move(grid, gridSize, 'up',true);
                combine(grid, gridSize, 'up');  
                move(grid, gridSize, 'up',false);
                animateDirection = 'up';
                inputStates.up = false;
              }
          if (inputStates.right) {
                move(grid, gridSize, 'right',true);
                combine(grid, gridSize, 'right');
                move(grid, gridSize, 'right',false);
                animateDirection = 'right';
                inputStates.right = false;
              }
          if (inputStates.down) {
                move(grid, gridSize, 'down',true);
                combine(grid, gridSize, 'down');
                move(grid, gridSize, 'down',false);
                animateDirection = 'down';
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

      function getGridSize(e){
        let rect = e.target.getBoundingClientRect();
        let x = e.clientX - rect.left;
        let y = e.clientY - rect.top;
        let offSet = 40;
        let originX = (w/4)-offSet/2;
        let originY = h/3;
        let sqSize = w/4;

        //top left
        if ( x>=originX && x <= originX+sqSize && y >= originY && y <= originY+sqSize){
            gridSize = 4;
            gameState = 'game';
        }

        //top right
        if ( x>=originX + sqSize + offSet && x <= originX + 2*sqSize + offSet && y >= originY && y <= originY+sqSize){
            gridSize = 5;
            gameState = 'game';
        }

        //bot right
        if ( x>=originX && x <= originX+sqSize && y>=originY + sqSize + offSet && y <= originY + 2*sqSize + offSet ){
          //  console.log('mid left');
          gridSize = 6;
          gameState = 'game';
        }

        //bot right
        if ( x>=originX + sqSize + offSet && x <= originX + 2*sqSize + offSet  && y>=originY + sqSize + offSet && y <= originY + 2*sqSize + offSet ){
          gridSize = 7;
          gameState = 'game';
      }

      }

      function drawMenu(){

        let offSet = 40;
        let sqSize = w/4;
        let originX = (w/4)-offSet/2;
        let originY = h/3;

        ctx.clearRect(0, 0, w, h);

        ctx.save();
        ctx.fillStyle = "rgb(108, 40, 141)";
        ctx.font="55px Monospace";
        ctx.textAlign="center"; 
        ctx.textBaseline = "middle";
        ctx.fillText("2048",w/2,h/6);
        ctx.restore();
        
        ctx.save();
        ctx.translate(originX, originY);
        ctx.strokeStyle = "rgb(108, 40, 141)";
        ctx.lineWidth = 2;
        ctx.strokeRect(0, 0, sqSize,sqSize);
        ctx.fillStyle = "rgb(108, 40, 141)";
        ctx.font="55px Monospace";
        ctx.textAlign="center"; 
        ctx.textBaseline = "middle";
        ctx.fillText("4x4",sqSize/2,sqSize/2);
        ctx.restore();

        ctx.save();
        ctx.translate(originX, originY + sqSize + offSet);
        ctx.strokeStyle = "rgb(108, 40, 141)";
        ctx.lineWidth = 2;
        ctx.strokeRect(0, 0, sqSize,sqSize);
        ctx.fillStyle = "rgb(108, 40, 141)";
        ctx.font="55px Monospace";
        ctx.textAlign="center"; 
        ctx.textBaseline = "middle";
        ctx.fillText("6x6",sqSize/2,sqSize/2);
        ctx.restore();

        ctx.save();
        ctx.translate(originX + sqSize + offSet, originY);
        ctx.strokeStyle = "rgb(108, 40, 141)";
        ctx.lineWidth = 2;
        ctx.strokeRect(0, 0, sqSize,sqSize);
        ctx.fillStyle = "rgb(108, 40, 141)";
        ctx.font="55px Monospace";
        ctx.textAlign="center"; 
        ctx.textBaseline = "middle";
        ctx.fillText("5x5",sqSize/2,sqSize/2);
        ctx.restore();

        ctx.save();
        ctx.translate(originX + sqSize + offSet, originY + sqSize + offSet);
        ctx.strokeStyle = "rgb(108, 40, 141)";
        ctx.lineWidth = 2;
        ctx.strokeRect(0, 0, sqSize,sqSize);
        ctx.fillStyle = "rgb(108, 40, 141)";
        ctx.font="55px Monospace";
        ctx.textAlign="center"; 
        ctx.textBaseline = "middle";
        ctx.fillText("7x7",sqSize/2,sqSize/2);
        ctx.restore();
      }

      function menuScreen(){

        canvas = document.querySelector("#myCanvas");
        canvas.removeEventListener('click', restart);
        canvas.addEventListener('click', getGridSize);
        drawMenu();
        setUp = true;

        inputStates.left = false;
        inputStates.right = false;
        inputStates.up = false;
        inputStates.down = false;
        inputStates.space = false;

      }

      function drawGameOver(){
        let textWidth = w/2;
        let textHeight = h/4;
        let btnHeight = h/6;
        let btnWidth = w/4;

        clearGrid(gridSize);
        drawGridValues(grid, gridSize, false);
        drawGrid();

        ctx.save();
        ctx.fillStyle = ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
        ctx.fillRect(0,0,w,h);
        ctx.restore();
        drawEnd = false;

        ctx.save();
        ctx.translate(w/2 - textWidth/2, h/4);
        ctx.textAlign="center";
        ctx.textBaseline = "middle";
        ctx.font="80px Monospace";
        ctx.fillText("Game Over", textWidth/2,textHeight/2);
        ctx.restore();

        ctx.save();
        ctx.translate(w/2 - btnWidth/2, h/2 + 20);
        ctx.strokeRect(0,0,btnWidth,btnHeight);
        ctx.textAlign="center"; 
        ctx.textBaseline = "middle";
        ctx.font="40px Monospace";
        ctx.fillText("Restart", btnWidth/2,btnHeight/2);
        ctx.restore();
      }

      function drawWinScreen(){
        let textWidth = w/2;
        let textHeight = h/4;
        let btnHeight = h/6;
        let btnWidth = w/4;

        clearGrid(gridSize);
        drawGridValues(grid, gridSize, false);
        drawGrid();

        ctx.save();
        ctx.fillStyle = ctx.fillStyle = "rgba(255, 255, 0, 0.5)";
        ctx.fillRect(0,0,w,h);
        ctx.restore();
        drawEnd = false;

        ctx.save();
        ctx.translate(w/2 - textWidth/2, h/4);
        ctx.textAlign="center";
        ctx.textBaseline = "middle";
        ctx.font="80px Monospace";
        ctx.fillText("You Win!", textWidth/2,textHeight/2);
        ctx.restore();

        ctx.save();
        ctx.translate(w/2 - btnWidth/2, h/2 + 20);
        ctx.strokeRect(0,0,btnWidth,btnHeight);
        ctx.textAlign="center"; 
        ctx.textBaseline = "middle";
        ctx.font="40px Monospace";
        ctx.fillText("Restart", btnWidth/2,btnHeight/2);
        ctx.restore();

      }

      function checkGameOver(grid, gridSize, goal){
        for (let x = 0; x < gridSize; x++) {
          for (let y = 0; y < gridSize; y++) {
            if (grid[x][y] >= goal){
              canvas = document.querySelector("#myCanvas");
              canvas.addEventListener('click', restart);
              gameState = 'gameOver';
              if (drawEnd){
                drawWinScreen();
              }
            }
          }
        }

        
        if (!checkPossibleMoves(grid, gridSize)){
          canvas = document.querySelector("#myCanvas");
          canvas.addEventListener('click', restart);
          gameState = 'gameOver';
          if (drawEnd){
            drawGameOver();
          }
        }
      }

      function restart(e){
        let rect = e.target.getBoundingClientRect();
        let x = e.clientX - rect.left;
        let y = e.clientY - rect.top;
        
        let btnWidth = w/4;
        let btnHeight = h/6;
        let originX = w/2 - btnWidth/2;
        let originY = h/2 + 20;

        if ( x>=originX && x <= originX+btnWidth && y >= originY && y <= originY+btnHeight){
          gameState = 'menu';
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

        switch (gameState){

          case 'menu':
            menuScreen();
            break;


          case 'game':

            if (setUp){
              startGrid(gridSize);
              clearGrid(gridSize);
                
              // Draw values
              drawGridValues(grid, gridSize, true);
              // drawGridValues(blocks);
              
              drawGrid();

              canvas.removeEventListener('click', getGridSize);

              setUp = false;
              drawEnd = true;
              animateDirection = 'none';
            }

            if (frame >= 7){
              animateDirection = 'none';
              createBlock(grid,blocks);
              // Clear the grid
              clearGrid(gridSize);
                
              // Draw values
              drawGridValues(grid, gridSize, true);
              // drawGridValues(blocks);
              
              drawGrid();
            }
    
              //main function, called each frame 
              // measureFPS(time);
    
              if (animateDirection == 'none'){
                
                frame = 1;
    
                // check inputStates
                checkInputs(grid, gridSize, time);
                
                // Check for game over
                checkGameOver(grid, gridSize, goal);
              }
    
                else{
                  if (frame == 1){
                    animateMove(grid,gridSize,animateDirection,frame,true);
                  }
                  else{
                    animateMove(grid,gridSize,animateDirection,frame,false);
                  }
                  frame++;
              }   
              break;


              case 'gameOver':

                break;

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

        // swiped-left
          document.addEventListener('swiped-left', function(e) {
            inputStates.left = true;
        });
        // swiped-right
        document.addEventListener('swiped-right', function(e) {
          inputStates.right = true;
        });
        // swiped-up
        document.addEventListener('swiped-up', function(e) {
          inputStates.up = true;
        });
        // swiped-down
        document.addEventListener('swiped-down', function(e) {
          inputStates.down = true;
        });

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
    

          // start the animation
          requestAnimationFrame(mainLoop);
      };
  
      //our GameFramework returns a public API visible from outside its scope
      return {
          start: start
      };
  };