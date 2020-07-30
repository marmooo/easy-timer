const noSleep = new NoSleep();
const tmpCanvas = document.createElement('canvas');
const remSize = parseInt(getComputedStyle(document.documentElement).fontSize);
let bgm = new Audio('mp3/bgm.mp3');
bgm.volume = 0.5;
let sound = new Audio();
let timerInterval;
let vibrateInterval;
let duration = 0;
let startTime;

function loadConfig() {
  if (localStorage.getItem('darkMode') == 1) {
    document.body.dataset.theme = 'dark';
  }
  if (localStorage.getItem('bgm') == 1) {
    var button = document.getElementById('bgmButton');
    button.classList.remove('close');
  }
  if (localStorage.getItem('noSleep') == 1) {
    var button = document.getElementById('noSleepButton');
    button.classList.remove('close');
  }
}
loadConfig();

function stopTimer() {
  clearInterval(timerInterval);
  bgm.pause();
  var button = document.getElementById('startButton');
  button.innerText = 'スタート';
  button.onclick = function() { startTimer() };
}
function startTimer() {
  sound.src = 'mp3/' + document.getElementById('sound').value + '.mp3';
  if (!isNaN(duration) && duration > 0) {
    var button = document.getElementById('startButton');
    button.innerText = 'ストップ';
    button.onclick = function() { stopTimer(); }
    startTime = Date.now();
    timerInterval = setInterval(function() {
      tick();
    }, 1000);
  }
}
function resetTimer() {
  if (timerInterval) {
    clearInterval(timerInterval);
  }
  bgm.pause();
  sound.pause();
  var button = document.getElementById('startButton');
  button.innerText = 'スタート';
  button.onclick = function() { startTimer() };
  var timerText = document.getElementById('timerText');
  var timerValue = document.getElementById('timerValue');
  var t = parseInt(timerValue.value);
  duration = t * 60000;
  if (isNaN(duration) || duration < 0) {
    duration = 0;
  } else if (999 < t) {
    timerValue.value = 999;
    duration = 999 * 60000;
  }
  var min = Math.floor(duration / 60000);
  var sec = Math.floor(Math.abs(duration) % 60000 / 1000);
  timerText.innerText = min + ':' + ('0' + sec).slice(-2);
  resizeFontSize(timerText);
}
function tick() {
  var timerText = document.getElementById('timerText');
  var min;
  var t = startTime + duration - Date.now();
  if (t < 0) {  // time over
    bgm.pause();
    if (t < -300000) {  // 5min over
      sound.pause();
      clearInterval(vibrateInterval);
    } else {
      if (sound.src.includes('none.mp3')) {
        if (!vibrateInterval) {
          vibrateInterval = setInterval(function() {
            navigator.vibrate(200);
          }, 200);
        }
      } else {
        sound.play();
      }
    }
    min = Math.ceil(t / 60000);
    if (min == 0) { min = '-0'; }
  } else {
    if (localStorage.getItem('bgm') == 1) {
      bgm.loop = true;
      bgm.play();
    }
    min = Math.floor(t / 60000);
  }
  var sec = Math.floor(Math.abs(t) % 60000 / 1000);
  timerText.innerText = min + ':' + ('0' + sec).slice(-2);
  resizeFontSize(timerText);
}
function changeSound() {
  sound.src = 'mp3/' + document.getElementById('sound').value + '.mp3';
}
function checkSound() {
  sound.pause();
  changeSound();
  sound.loop = false;
  sound.play();
}
// https://stackoverflow.com/questions/118241/
function getTextWidth(text, font) {
    // re-use canvas object for better performance
    // var canvas = getTextWidth.canvas || (getTextWidth.canvas = document.createElement("canvas"));
    var context = tmpCanvas.getContext("2d");
    context.font = font;
    var metrics = context.measureText(text);
    return metrics.width;
}
function calcTimerTextHeight() {
  var headerHeight = document.getElementById('header').clientHeight;
  var timerHeaderHeight = document.getElementById('timerHeader').clientHeight;
  var timerFooterHeight = document.getElementById('timerFooter').clientHeight;
  return document.documentElement.clientHeight - headerHeight - timerHeaderHeight - timerFooterHeight;
}
function resizeFontSize(node) {
  var outer = document.getElementById('timerHeader');
  var textLength = node.innerText.length;
  var rowLength = getTextWidth(node.innerText, "16px sans-serif");
  // https://stackoverflow.com/questions/46653569/
  // Safariで正確な算出ができないので誤差ぶんだけ縮小化 (10%)
  var marginPadding = remSize * 2.5;
  var rowFontSize = 16 * (outer.clientWidth - marginPadding) / rowLength * 0.90;
  var colFontSize = (calcTimerTextHeight() - marginPadding) * 0.90;
  if (colFontSize < rowFontSize) {
    node.style.fontSize = colFontSize + 'px';
  } else {
    node.style.fontSize = rowFontSize + 'px';
  }
}
function toggleNoSleep() {
  var button = document.getElementById('noSleepButton');
  if (localStorage.getItem('noSleep') == 1) {
    button.classList.add('close');
    localStorage.setItem('noSleep', 0);
    noSleep.disable();
  } else {
    button.classList.remove('close');
    localStorage.setItem('noSleep', 1);
    noSleep.enable();
  }
}
function toggleBGM() {
  var button = document.getElementById('bgmButton');
  console.log(localStorage.getItem('bgm'));
  if (localStorage.getItem('bgm') == 1) {
    button.classList.add('close');
    localStorage.setItem('bgm', 0);
    bgm.pause();
  } else {
    button.classList.remove('close');
    localStorage.setItem('bgm', 1);
    bgm.loop = false;
    bgm.play();
  }
}
function toggleDarkMode() {
  if (localStorage.getItem('darkMode') == 1) {
    localStorage.setItem('darkMode', 0);
    delete document.body.dataset.theme;
  } else {
    localStorage.setItem('darkMode', 1);
    document.body.dataset.theme = 'dark';
  }
}
var timerText = document.getElementById('timerText');
resizeFontSize(timerText);
window.addEventListener('resize', function() {
  resizeFontSize(timerText);
});
