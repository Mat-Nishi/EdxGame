var GF = function(){


    // vars for counting frames/s, used by the measureFPS function
    var frameCount = 0;
    var lastTime;
    var fpsContainer;
    var fps;
    var measureFPS = function(newTime){
    // test for the very first invocation
    if(lastTime === undefined) {
        lastTime = newTime;
        return;
    }
    // calculate the delta between last & current frame
    var diffTime = newTime - lastTime;
    if (diffTime >= 1000) {
        fps = frameCount;
        frameCount = 0;
        lastTime = newTime;
    }
    // and display it in an element we appended to the
    // document in the start() function
    fpsContainer.innerHTML = 'FPS: ' + fps;
    frameCount++;
    };


    var mainLoop = function(time){
        //Main function, called each frame
        // compute FPS, called each frame, uses the high resolution time parameter 
        // given by the browser that implements the requestAnimationFrame API
        measureFPS(time);
        requestAnimationFrame(mainLoop);
    };


    var start = function(){

        // adds a div for displaying the fps value
        fpsContainer = document.createElement('div');
        document.body.appendChild(fpsContainer);
        requestAnimationFrame(mainLoop);
        requestAnimationFrame(mainLoop);
        
    };


    // Our GameFramework returns a public API visible from outside its scope
    // Here we only expose the start method, under the "start" property name.
    return {
      start: start
    };
  };


var game = new GF();
// Launch the game, start the animation loop, etc.

window.onload = game.start();