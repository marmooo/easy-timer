const noSleep = new NoSleep();
const tmpCanvas = document.createElement('canvas');
let bgm = new Audio('mp3/bgm.mp3');
bgm.volume = 0.5;
let sound = new Audio();
let timerInterval;
let vibrateInterval;
let duration = 0;
let startTime;
let remainingTime;

function loadConfig() {
  if (localStorage.getItem('darkMode') == 1) {
    document.documentElement.dataset.theme = 'dark';
  }
  if (localStorage.getItem('bgm') != 1) {
    document.getElementById('bgmOn').classList.add('d-none');
    document.getElementById('bgmOff').classList.remove('d-none');
  }
  if (localStorage.getItem('noSleep') != 1) {
    document.getElementById('noSleepOn').classList.add('d-none');
    document.getElementById('noSleepOff').classList.remove('d-none');
  }
}
loadConfig();

function stopTimer() {
  clearInterval(timerInterval);
  bgm.pause();
  sound.pause();
  if (vibrateInterval) {
    clearInterval(vibrateInterval);
  }
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
    if (remainingTime != 0) {
      startTime = Date.now() - duration + remainingTime;
    } else {
      startTime = Date.now();
    }
    timerInterval = setInterval(function() {
      tick();
    }, 200);
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
  remainingTime = startTime + duration - Date.now();
  if (remainingTime < 0) {  // time over
    bgm.pause();
    if (remainingTime < -300000) {  // 5min over
      sound.pause();
      clearInterval(vibrateInterval);
    } else {
      if (sound.src.includes('none.mp3')) {
        if (!vibrateInterval) {
          vibrateInterval = setInterval(function() {
            navigator.vibrate(400);
          }, 400);
        }
      } else {
        sound.play();
      }
    }
    min = Math.ceil(remainingTime / 60000);
    if (min == 0) { min = '-0'; }
  } else {
    if (localStorage.getItem('bgm') == 1) {
      bgm.loop = true;
      bgm.play();
    }
    min = Math.floor(remainingTime / 60000);
  }
  var sec = Math.floor(Math.abs(remainingTime) % 60000 / 1000);
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

function resizeFontSize(node) {
  // https://stackoverflow.com/questions/118241/
  function getTextWidth(text, font) {
      // re-use canvas object for better performance
      // var canvas = getTextWidth.canvas || (getTextWidth.canvas = document.createElement("canvas"));
      var context = tmpCanvas.getContext("2d");
      context.font = font;
      var metrics = context.measureText(text);
      return metrics.width;
  }
  function getTextRect(text, fontSize, font, lineHeight) {
    var lines = text.split('\n');
    var maxWidth = 0;
    var fontConfig = fontSize + 'px ' + font;
    for (var i=0; i<lines.length; i++) {
      var width = getTextWidth(lines[i], fontConfig);
      if (maxWidth < width) {
        maxWidth = width;
      }
    }
    return [maxWidth, fontSize * lines.length * lineHeight];
  }
  function getNodeRect() {
    var headerHeight = document.getElementById('header').clientHeight;
    var timerHeader = document.getElementById('timerHeader');
    var timerFooterHeight = document.getElementById('timerFooter').clientHeight;
    var height = document.documentElement.clientHeight - headerHeight - timerHeader.clientHeight - timerFooterHeight;
    return [timerHeader.clientWidth, height];
  }
  function getPaddingRect(style) {
    var width = parseFloat(style.paddingLeft) + parseFloat(style.paddingRight);
    var height = parseFloat(style.paddingTop) + parseFloat(style.paddingBottom);
    return [width, height];
  }
  var style = getComputedStyle(node);
  var font = style.fontFamily;
  var fontSize = parseFloat(style.fontSize);
  var lineHeight = parseFloat(style.lineHeight) / fontSize;
  var nodeRect = getNodeRect();
  var textRect = getTextRect(node.innerText, fontSize, font, lineHeight);
  var paddingRect = getPaddingRect(style);

  // https://stackoverflow.com/questions/46653569/
  // Safariで正確な算出ができないので誤差ぶんだけ縮小化 (10%)
  var rowFontSize = fontSize * (nodeRect[0] - paddingRect[0]) / textRect[0] * 0.90;
  var colFontSize = fontSize * (nodeRect[1] - paddingRect[1]) / textRect[1] * 0.90;
  if (colFontSize < rowFontSize) {
    node.style.fontSize = colFontSize + 'px';
  } else {
    node.style.fontSize = rowFontSize + 'px';
  }
}

function toggleNoSleep() {
  var button = document.getElementById('noSleepButton');
  if (localStorage.getItem('noSleep') == 1) {
    document.getElementById('noSleepOn').classList.add('d-none');
    document.getElementById('noSleepOff').classList.remove('d-none');
    localStorage.setItem('noSleep', 0);
    noSleep.disable();
  } else {
    document.getElementById('noSleepOn').classList.remove('d-none');
    document.getElementById('noSleepOff').classList.add('d-none');
    localStorage.setItem('noSleep', 1);
    noSleep.enable();
  }
}

function toggleBGM() {
  var button = document.getElementById('bgmButton');
  if (localStorage.getItem('bgm') == 1) {
    document.getElementById('bgmOn').classList.add('d-none');
    document.getElementById('bgmOff').classList.remove('d-none');
    localStorage.setItem('bgm', 0);
    bgm.pause();
  } else {
    document.getElementById('bgmOn').classList.remove('d-none');
    document.getElementById('bgmOff').classList.add('d-none');
    localStorage.setItem('bgm', 1);
    bgm.loop = false;
    bgm.play();
  }
}

function toggleDarkMode() {
  if (localStorage.getItem('darkMode') == 1) {
    localStorage.setItem('darkMode', 0);
    delete document.documentElement.dataset.theme;
  } else {
    localStorage.setItem('darkMode', 1);
    document.documentElement.dataset.theme = 'dark';
  }
}

var timerText = document.getElementById('timerText');
resizeFontSize(timerText);
window.addEventListener('resize', function() {
  resizeFontSize(timerText);
});
