// main.js

const hrsUnit = document.querySelector('#HRS');
const minUnit = document.querySelector('#MIN');
const secUnit = document.querySelector('#SEC');

const hrsScreen = hrsUnit.querySelector('.screen');
const minScreen = minUnit.querySelector('.screen');
const secScreen = secUnit.querySelector('.screen');

const startBtn = document.querySelector('.start-btn');
const resetBtn = document.querySelector('.reset-btn');

const startBtnImg = startBtn.querySelector('img');
const resetBtnImg = resetBtn.querySelector('img');


let totalSeconds = 0;
let timerId = null;
let isRunning = false;

function getInputTotalSeconds() {
  const hrs = parseInt(hrsInput.value) || 0;
  const min = parseInt(minInput.value) || 0;
  const sec = parseInt(secInput.value) || 0;
  return hrs * 3600 + min * 60 + sec;
}

function updateButtons() {
  const inputSeconds = getInputTotalSeconds();
  const hasInput = inputSeconds > 0;
  const hasTimeOnTimer = totalSeconds > 0;

  // start: 입력 없으면 disabled / 입력 있으면 default / 실행 중이면 pause 이미지
  if (isRunning) {
    startBtn.disabled = false;
    startBtnImg.src = './img/button/pause.png';
  } else {
    startBtn.disabled = !hasInput && !hasTimeOnTimer;
    startBtnImg.src = startBtn.disabled ? './img/button/start-disabled.png' : './img/button/start-default.png';
  }

  // reset: 입력했으면 default / 아니면 disabled
  // (카운트 중(totalSeconds>0)이면 화면 값이 0이 아니므로 자동으로 default가 됨)
  resetBtn.disabled = !hasInput && !hasTimeOnTimer;
  resetBtnImg.src = resetBtn.disabled ? './img/button/reset-disabled.png' : './img/button/reset-default.png';
}


// -------------------------------
// 입력 필드 생성 (screen을 input으로 교체)
// -------------------------------
function createInput(unitScreen, max) {
  const input = document.createElement('input');
  input.type = 'number';
  input.min = 0;
  input.max = max;
  input.value = 0;

  input.classList.add('screen'); // 또는 'custom-input'
  unitScreen.replaceWith(input);
  return input;
}

const hrsInput = createInput(hrsScreen, 99);
const minInput = createInput(minScreen, 59);
const secInput = createInput(secScreen, 59);


function clampInputs() {
  hrsInput.value = Math.min(Math.max(parseInt(hrsInput.value) || 0, 0), 99);
  minInput.value = Math.min(Math.max(parseInt(minInput.value) || 0, 0), 59);
  secInput.value = Math.min(Math.max(parseInt(secInput.value) || 0, 0), 59);
}

[hrsInput, minInput, secInput].forEach((inp) => {
  inp.addEventListener('input', () => {
    if (isRunning) return;      // 실행 중엔 입력 무시(원하면 제거)
    clampInputs();
    updateButtons();
  });
});



// -------------------------------
// 시간 표시 포맷
// -------------------------------
function format(num) {
    return String(num).padStart(2, '0');
}

function updateDisplay() {
    const hrs = Math.floor(totalSeconds / 3600);
    const min = Math.floor((totalSeconds % 3600) / 60);
    const sec = totalSeconds % 60;

    hrsInput.value = format(hrs);
    minInput.value = format(min);
    secInput.value = format(sec);
}

// -------------------------------
// 입력값 → 초 변환
// -------------------------------
function setTotalSecondsFromInput() {
    const hrs = parseInt(hrsInput.value) || 0;
    const min = parseInt(minInput.value) || 0;
    const sec = parseInt(secInput.value) || 0;

    totalSeconds = hrs * 3600 + min * 60 + sec;
}

// -------------------------------
// 타이머 로직
// -------------------------------
function startTimer() {
  if (isRunning) return;

  if (totalSeconds === 0) {
    setTotalSecondsFromInput();
    if (totalSeconds === 0) {
      updateButtons();
      return;
    }
  }

  isRunning = true;
  updateButtons();

  timerId = setInterval(() => {
    if (totalSeconds > 0) {
      totalSeconds--;
      updateDisplay();
      updateButtons();
    } else {
      clearInterval(timerId);
      isRunning = false;
      updateButtons();
    }
  }, 1000);
}

function pauseTimer() {
  clearInterval(timerId);
  isRunning = false;
  updateButtons();
}

function resetTimer() {
  clearInterval(timerId);
  isRunning = false;
  totalSeconds = 0;
  updateDisplay();
  updateButtons();
}


// -------------------------------
// 버튼 이벤트
// -------------------------------
startBtn.addEventListener('click', () => {
    if (isRunning) {
        pauseTimer();
    } else {
        startTimer();
    }
});

resetBtn.addEventListener('click', resetTimer);

// -------------------------------
// 초기화
// -------------------------------
updateDisplay();
updateDisplay();
updateButtons();
