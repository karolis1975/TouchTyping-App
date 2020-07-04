const keys = document.querySelectorAll(".input");
const text = document.querySelector(".text");
const infoKeys = document.querySelectorAll(".key");
const error = document.querySelector(".error");
const speed = document.querySelector(".speed");
const current = document.querySelector(".current");
const mode = document.querySelector(".mode");
const best = document.querySelector(".best");

const unlockedLetters = [];
const mustLetters = ["e", "n", "i", "t", "r"];
const allLetters = [
  "e",
  "n",
  "i",
  "t",
  "r",
  "l",
  "s",
  "a",
  "u",
  "o",
  "d",
  "y",
  "c",
  "h",
  "g",
  "m",
  "p",
  "b",
  "k",
  "v",
  "w",
  "f",
  "z",
  "x",
  "q",
  "j",
];
let balsiai = [];
let pusBalsiai = [];
let prieBalsiai = [];
let letters = 0;
let errors = 0;
let wpm = 0;
let time = 0;
let intervalID = null;
let bestScore = 0;
let currentLetter = null;
const howManyWords = 16;

if (localStorage.getItem("best") != null) {
  bestScore = localStorage.getItem("best");
  best.textContent = bestScore;
}

if (localStorage.getItem("unlocked") != null) {
  let local = localStorage.getItem("unlocked");
  unlockedLetters.push(...JSON.parse(local));
  currentLetter = allLetters[unlockedLetters.length];
} else {
  unlockedLetters.push(...mustLetters);
  currentLetter = allLetters[unlockedLetters.length];
}
current.textContent = currentLetter;

function counter() {
  time += 0.1;
}
function stopTimer() {
  time = 0;
  clearInterval(intervalID);
}
function balses() {
  unlockedLetters.forEach((lt) => {
    switch (lt) {
      case "a":
      case "e":
      case "i":
      case "u":
      case "y":
      case "o":
        balsiai.push(lt);
        break;
      case "t":
      case "b":
      case "d":
      case "g":
      case "h":
      case "z":
      case "c":
      case "x":
      case "f":
      case "k":
      case "p":
      case "s":
      case "t":
      case "q":
      case "w":
        prieBalsiai.push(lt);
        break;
      case "n":
      case "r":
      case "l":
      case "j":
      case "m":
      case "v":
        pusBalsiai.push(lt);
        break;
    }
  });
}
balses();
unlockedKeys();
function unlockedKeys() {
  infoKeys.forEach((key, index) => {
    if (key.textContent.toLowerCase() == unlockedLetters[index])
      key.classList.add("unlocked");
  });
}
document.onkeydown = (e) => {
  keys.forEach((key) => {
    if (key.getAttribute("data-id") == e.code) {
      key.classList.add("pressed");
      const letter = text.querySelectorAll(".letter");
      if (time == 0) {
        errors = 0;
        error.textContent = errors;
        intervalID = setInterval(counter, 100);
      }
      if (text.textContent[letters] == e.key) {
        if (letter[letters].nextElementSibling == null) {
          wpm = (howManyWords * 60) / time;
          wpm = Math.round(wpm * 100) / 100;
          speed.textContent = wpm;
          if (wpm > bestScore) {
            bestScore = wpm;
            localStorage.setItem("best", bestScore);
            best.textContent = bestScore;
          }
          if (wpm >= 40 && errors <= 2) {
            let newLetter = allLetters[unlockedLetters.length];
            currentLetter = allLetters[unlockedLetters.length + 1];
            current.textContent = currentLetter;

            unlockedLetters.push(newLetter);
            localStorage.setItem("unlocked", JSON.stringify(unlockedLetters));
            unlockedKeys();
            balses();
          }
          stopTimer();
          generateWords();
        } else {
          letter[letters].classList.add("pastLetter");
          letter[letters].classList.remove("currentLetter");
          letters++;
          letter[letters].classList.add("currentLetter");
        }
      } else if (text.textContent[letters] == "_") {
        if (e.code == "Space") {
          letter[letters].classList.add("pastLetter");
          letter[letters].classList.remove("currentLetter");
          letters++;
          letter[letters].classList.add("currentLetter");
        }
      } else {
        letter[letters].classList.add("failedLetter");
        errors++;
        error.textContent = errors;
      }
    }
  });
};
document.onkeyup = (e) => {
  keys.forEach((key) => {
    if (key.getAttribute("data-id") == e.code) {
      key.classList.remove("pressed");
    }
  });
};

generateWords();
function generateWords() {
  letters = 0;

  let randomWordCount = null;
  let randomFirstLetterCount = null;
  let randomLetter = null;
  let randomNextCount = null;
  let rand = null;
  let isIncluded = false;
  text.innerHTML = "";

  for (let i = 0; i < howManyWords; i++) {
    randomWordCount = Math.floor(Math.random() * 4) + 2;
    randomFirstLetterCount = Math.floor(
      Math.random() * unlockedLetters.length + 1
    );
    randomLetter = allLetters[randomFirstLetterCount];
    text.innerHTML += `<span class="letter">${randomLetter}</span>`;
    isIncluded = false;

    for (let j = 0; j < randomWordCount; j++) {
      switch (randomLetter) {
        case "a":
        case "e":
        case "i":
        case "u":
        case "y":
        case "o":
          rand = Math.floor(Math.random() * 2);
          if (rand == 0) {
            randomNextCount = Math.floor(Math.random() * prieBalsiai.length);
            if (
              isIncluded == false &&
              currentLetter != prieBalsiai[randomNextCount]
            ) {
              switch (currentLetter) {
                case "t":
                case "b":
                case "d":
                case "g":
                case "h":
                case "z":
                case "c":
                case "x":
                case "f":
                case "k":
                case "p":
                case "s":
                case "t":
                  randomLetter = currentLetter;
                  isIncluded = true;
                  break;
                default:
                  randomLetter = prieBalsiai[randomNextCount];
                  break;
              }
            } else {
              randomLetter = prieBalsiai[randomNextCount];
            }
          } else {
            randomNextCount = Math.floor(Math.random() * pusBalsiai.length);
            if (
              isIncluded == false &&
              currentLetter != pusBalsiai[randomNextCount]
            ) {
              switch (currentLetter) {
                case "n":
                case "r":
                case "l":
                case "j":
                case "m":
                case "v":
                  randomLetter = currentLetter;
                  isIncluded = true;
                  break;
                default:
                  randomLetter = pusBalsiai[randomNextCount];
                  break;
              }
            } else randomLetter = pusBalsiai[randomNextCount];
          }
          text.innerHTML += `<span class="letter">${randomLetter}</span>`;
          break;
        case "t":
        case "b":
        case "d":
        case "g":
        case "h":
        case "z":
        case "c":
        case "x":
        case "f":
        case "k":
        case "p":
        case "s":
        case "t":
          rand = Math.floor(Math.random() * 2);
          if (rand == 0) {
            randomNextCount = Math.floor(Math.random() * balsiai.length);
            if (
              isIncluded == false &&
              currentLetter != balsiai[randomNextCount]
            ) {
              switch (currentLetter) {
                case "a":
                case "e":
                case "i":
                case "u":
                case "y":
                case "o":
                  randomLetter = currentLetter;
                  isIncluded = true;
                  break;
                default:
                  randomLetter = balsiai[randomNextCount];
                  break;
              }
            } else randomLetter = balsiai[randomNextCount];
          } else {
            randomNextCount = Math.floor(Math.random() * pusBalsiai.length);
            if (
              isIncluded == false &&
              currentLetter != pusBalsiai[randomNextCount]
            ) {
              switch (currentLetter) {
                case "n":
                case "r":
                case "l":
                case "j":
                case "m":
                case "v":
                  randomLetter = currentLetter;
                  isIncluded = true;
                  break;
                default:
                  randomLetter = pusBalsiai[randomNextCount];
                  break;
              }
            } else {
              randomLetter = pusBalsiai[randomNextCount];
            }
          }
          text.innerHTML += `<span class="letter">${randomLetter}</span>`;
          break;
        case "n":
        case "r":
        case "l":
        case "j":
        case "m":
        case "v":
          randomNextCount = Math.floor(Math.random() * balsiai.length);
          if (
            isIncluded == false &&
            currentLetter != balsiai[randomNextCount]
          ) {
            switch (currentLetter) {
              case "a":
              case "e":
              case "i":
              case "u":
              case "y":
              case "o":
                randomLetter = currentLetter;
                isIncluded = true;
                break;
              default:
                randomLetter = balsiai[randomNextCount];
                break;
            }
          } else {
            randomLetter = balsiai[randomNextCount];
          }
          text.innerHTML += `<span class="letter">${randomLetter}</span>`;
          break;
      }
    }
    if (i < howManyWords - 1) text.innerHTML += `<span class="letter">_</span>`;
  }
  if (letters == 0)
    text.querySelectorAll(".letter")[letters].classList.add("currentLetter");
}

mode.addEventListener("click", changeColor);
let root = document.documentElement;
function changeColor() {
  if (mode.textContent == "☀ Light") {
    root.style.setProperty("--primary", "rgb(19, 19, 19)");
    root.style.setProperty("--secondary", "rgb(216, 216, 216)");
    mode.textContent = "☽ Dark";
  } else {
    root.style.setProperty("--secondary", "rgb(19, 19, 19)");
    root.style.setProperty("--primary", "rgb(216, 216, 216)");
    mode.textContent = "☀ Light";
  }
}
