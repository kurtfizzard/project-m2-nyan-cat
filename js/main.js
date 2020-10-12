// We create an instance of the Engine class. Looking at our index.html,
// we see that it has a div with an id of `"app"`
const gameEngine = new Engine(document.getElementById("app"));

// keydownHandler is a variable that refers to a function. The function has one parameter
// (does the parameter name matter?) which is called event. As we will see below, this function
// will be called every time the user presses a key. The argument of the function call will be an object.
// The object will contain information about the key press, such as which key was pressed.
const keydownHandler = (event) => {
  // event.code contains a string. The string represents which key was press. If the
  // key is left, then we call the moveLeft method of gameEngine.player (where is this method defined?)
  if (event.code === "ArrowLeft") {
    gameEngine.player.moveLeft();
  }

  // If `event.code` is the string that represents a right arrow keypress,
  // then move our hamburger to the right
  if (event.code === "ArrowRight") {
    gameEngine.player.moveRight();
  }
};

const body = document.getElementsByTagName("body")[0];
body.style.display = "flex";
body.style.justifyContent = "center";

const container = document.getElementById("app");
container.style.position = `relative`;
container.style.overflow = "none";
container.style.height = "525px";
container.style.width = "525px";

// We add an event listener to document. document the ancestor of all DOM nodes in the DOM.
document.addEventListener("keydown", keydownHandler);

function playAudio(url) {
  const music = new Audio(url).play();
}

const START_BUTTON = document.createElement("button");
START_BUTTON.innerText = "Start";
START_BUTTON.style.backgroundColor = "yellow";
START_BUTTON.style.border = "none";
START_BUTTON.style.font = "bold 40px Monospace";
START_BUTTON.style.height = "100px";
START_BUTTON.style.position = "absolute";
START_BUTTON.style.top = "300px";
START_BUTTON.style.width = "300px";
START_BUTTON.style.zIndex = "500";
body.append(START_BUTTON);

let GAME_ON = false;

START_BUTTON.addEventListener("mousedown", () => {
  container.focus();
  // We call the gameLoop method to start the game
  gameEngine.gameLoop();
  GAME_ON = true;
  playAudio("./audio/gameaudio.wav");
  START_BUTTON.style.display = "none";
});
