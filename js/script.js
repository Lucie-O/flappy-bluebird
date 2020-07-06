// LINK TO HOME PAGE
const title = document.querySelector("header");

function handleTitleClick(e) {
  window.location.assign("index.html");
}

// CHOICE OF CONTROLS
const controlsOptions = document.querySelectorAll("article");

function handleControlsChoice(e) {
  if (e.target.id === "keyboard" || e.target.parentNode.id === "keyboard") {
    localStorage.setItem("controls", "keys");
    window.location.assign("game.html");
  } else if (e.target.id === "touchscreen" || e.target.parentNode.id === "touchscreen") {
    localStorage.setItem("controls", "touch");
    window.location.assign("game.html");
  }
}

function init() {
  // ADD EVENT LISTENERS
  title.addEventListener("click", handleTitleClick);
  controlsOptions[0].addEventListener("click", handleControlsChoice);
  controlsOptions[1].addEventListener("click", handleControlsChoice);
  controlsOptions[0].addEventListener("touchstart", function() {}); // makes css :active pseudo-class work on mobile Safari
  controlsOptions[1].addEventListener("touchstart", function() {});
}

window.onload = init;
