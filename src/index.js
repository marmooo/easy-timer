import nosleepJs from "https://cdn.jsdelivr.net/npm/nosleep.js@0.12.0/+esm";

const noSleep = new nosleepJs();
const timerText = document.getElementById("timerText");
const tmpCanvas = document.createElement("canvas");
const bgm = new Audio("mp3/bgm.mp3");
bgm.volume = 0.5;
const sound = new Audio();
let timerInterval;
let vibrateInterval;
let duration = 0;
let startTime;
let remainingTime;
loadConfig();

function loadConfig() {
  if (localStorage.getItem("darkMode") == 1) {
    document.documentElement.setAttribute("data-bs-theme", "dark");
  }
  if (localStorage.getItem("bgm") != 1) {
    document.getElementById("bgmOn").classList.add("d-none");
    document.getElementById("bgmOff").classList.remove("d-none");
  }
  if (localStorage.getItem("noSleep") == 1) {
    document.getElementById("noSleepOn").classList.remove("d-none");
    document.getElementById("noSleepOff").classList.add("d-none");
    document.addEventListener("pointerdown", () => {
      noSleep.enable();
    }, { once: true });
  }
}

function toggleDarkMode() {
  if (localStorage.getItem("darkMode") == 1) {
    localStorage.setItem("darkMode", 0);
    document.documentElement.setAttribute("data-bs-theme", "light");
  } else {
    localStorage.setItem("darkMode", 1);
    document.documentElement.setAttribute("data-bs-theme", "dark");
  }
}

function toggleTimer() {
  if (timerInterval) {
    timerText.classList.add("opacity-75");
    stopTimer();
  } else {
    startTimer();
    timerText.classList.remove("opacity-75");
  }
}

function stopTimer() {
  timerInterval = clearInterval(timerInterval);
  bgm.pause();
  sound.pause();
  if (vibrateInterval) {
    clearInterval(vibrateInterval);
  }
  const button = document.getElementById("startButton");
  button.textContent = "スタート";
}

function startTimer() {
  sound.src = "mp3/" + document.getElementById("changeSound").value + ".mp3";
  if (!isNaN(duration) && duration > 0) {
    const button = document.getElementById("startButton");
    button.textContent = "ストップ";
    if (remainingTime != 0) {
      startTime = Date.now() - duration + remainingTime;
    } else {
      startTime = Date.now();
    }
    timerInterval = setInterval(tick, 200);
  }
}

function resetTimer() {
  if (timerInterval) {
    clearInterval(timerInterval);
  }
  bgm.pause();
  sound.pause();
  if (vibrateInterval) {
    clearInterval(vibrateInterval);
  }
  remainingTime = 0;
  const button = document.getElementById("startButton");
  button.textContent = "スタート";
  const timerText = document.getElementById("timerText");
  const timerValue = document.getElementById("timerValue");
  const t = parseInt(timerValue.value);
  duration = t * 60000;
  if (isNaN(duration) || duration < 0) {
    duration = 0;
  } else if (999 < t) {
    timerValue.value = 999;
    duration = 999 * 60000;
  }
  const min = Math.floor(duration / 60000);
  const sec = Math.floor(Math.abs(duration) % 60000 / 1000);
  timerText.textContent = min + ":" + ("0" + sec).slice(-2);
  resizeFontSize(timerText);
}

function tick() {
  const timerText = document.getElementById("timerText");
  let min;
  remainingTime = startTime + duration - Date.now();
  if (remainingTime < 0) { // time over
    bgm.pause();
    if (remainingTime < -300000) { // 5min over
      sound.pause();
      clearInterval(vibrateInterval);
    } else {
      if (sound.src.includes("none.mp3")) {
        if (!vibrateInterval) {
          vibrateInterval = setInterval(() => {
            navigator.vibrate(400);
          }, 400);
        }
      } else {
        sound.play();
      }
    }
    min = Math.ceil(remainingTime / 60000);
    if (min == 0) min = "-0";
  } else {
    if (localStorage.getItem("bgm") == 1) {
      bgm.loop = true;
      bgm.play();
    }
    min = Math.floor(remainingTime / 60000);
  }
  const sec = Math.floor(Math.abs(remainingTime) % 60000 / 1000);
  timerText.textContent = min + ":" + ("0" + sec).slice(-2);
}

function changeSound() {
  sound.src = "mp3/" + document.getElementById("changeSound").value + ".mp3";
}

function resizeFontSize(node) {
  // https://stackoverflow.com/questions/118241/
  function getTextWidth(text, font) {
    // re-use canvas object for better performance
    // const canvas = getTextWidth.canvas || (getTextWidth.canvas = document.createElement("canvas"));
    const context = tmpCanvas.getContext("2d");
    context.font = font;
    const metrics = context.measureText(text);
    return metrics.width;
  }
  function getTextRect(text, fontSize, font, lineHeight) {
    const lines = text.split("\n");
    const fontConfig = fontSize + "px " + font;
    let maxWidth = 0;
    for (let i = 0; i < lines.length; i++) {
      const width = getTextWidth(lines[i], fontConfig);
      if (maxWidth < width) {
        maxWidth = width;
      }
    }
    return [maxWidth, fontSize * lines.length * lineHeight];
  }
  function getPaddingRect(style) {
    const width = parseFloat(style.paddingLeft) +
      parseFloat(style.paddingRight);
    const height = parseFloat(style.paddingTop) +
      parseFloat(style.paddingBottom);
    return [width, height];
  }
  const style = getComputedStyle(node);
  const font = style.fontFamily;
  const fontSize = parseFloat(style.fontSize);
  const lineHeight = parseFloat(style.lineHeight) / fontSize;
  const nodeRect = [node.parentNode.offsetWidth, node.parentNode.offsetHeight];
  const textRect = getTextRect(node.textContent, fontSize, font, lineHeight);
  const paddingRect = getPaddingRect(style);

  // https://stackoverflow.com/questions/46653569/
  // Safariで正確な算出ができないので誤差ぶんだけ縮小化 (10%)
  const rowFontSize = fontSize * (nodeRect[0] - paddingRect[0]) / textRect[0] *
    0.90;
  const colFontSize = fontSize * (nodeRect[1] - paddingRect[1]) / textRect[1] *
    0.90;
  if (colFontSize < rowFontSize) {
    node.style.fontSize = colFontSize + "px";
  } else {
    node.style.fontSize = rowFontSize + "px";
  }
}

function toggleNoSleep() {
  if (localStorage.getItem("noSleep") == 1) {
    document.getElementById("noSleepOn").classList.add("d-none");
    document.getElementById("noSleepOff").classList.remove("d-none");
    localStorage.setItem("noSleep", 0);
    noSleep.disable();
  } else {
    document.getElementById("noSleepOn").classList.remove("d-none");
    document.getElementById("noSleepOff").classList.add("d-none");
    localStorage.setItem("noSleep", 1);
    noSleep.enable();
  }
}

function toggleBGM() {
  if (localStorage.getItem("bgm") == 1) {
    document.getElementById("bgmOn").classList.add("d-none");
    document.getElementById("bgmOff").classList.remove("d-none");
    localStorage.setItem("bgm", 0);
    bgm.pause();
  } else {
    document.getElementById("bgmOn").classList.remove("d-none");
    document.getElementById("bgmOff").classList.add("d-none");
    localStorage.setItem("bgm", 1);
    bgm.loop = false;
    bgm.play();
  }
}

resizeFontSize(timerText);

document.getElementById("toggleDarkMode").onclick = toggleDarkMode;
document.getElementById("toggleBGM").onclick = toggleBGM;
document.getElementById("toggleNoSleep").onclick = toggleNoSleep;
document.getElementById("resetTimer").onclick = resetTimer;
document.getElementById("timerValue").onchange = resetTimer;
document.getElementById("changeSound").onchange = changeSound;
document.getElementById("startButton").onclick = toggleTimer;
console.log(document.getElementById("startButton"));
timerText.parentNode.onclick = toggleTimer;
globalThis.addEventListener("resize", () => {
  resizeFontSize(timerText);
});
