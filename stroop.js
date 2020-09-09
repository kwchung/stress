var START_TIME = 0;
var WORD = ["紅", "藍", "綠", "黃"];
var WORD2 = ["騿", "宸", "教", "曜"];
var COLOR = ["red", "blue", "green", "amber"];
var CURRENT_QUESTION_NUM = 0;
var STROOP_TOTAL_QUESTION_NUM = localStorage.getItem(
  "STROOP_TOTAL_QUESTION_NUM"
);

var registerModalInstance;
// ---------------彈出視窗(Modal)---------------
document.addEventListener("DOMContentLoaded", function () {
  let registerModal = document.getElementById("modal-register");
  registerModalInstance = M.Modal.init(registerModal, { opacity: 0.5 });
});

let el_inputName = document.getElementById("input-name");
el_inputName.addEventListener("keypress", function (e) {
  let key = e.which || e.keyCode;
  if (key === 13) {
    register();
  }
});

function setCurrentMode(mode) {
  localStorage.setItem("CURRENT_MODE", mode);
  window.location.href = "./stroop.html";
}

function showH3() {
  let CURRENT_SEQUENCE = parseInt(localStorage.getItem("CURRENT_SEQUENCE"));
  let content = "";
  if (CURRENT_SEQUENCE == -1) {
    content = "練習";
  } else {
    switch (parseInt(localStorage.getItem("CURRENT_MODE"))) {
      case 1:
        content = "模式一";
        break;
      case 2:
        content = "模式二";
        break;
      case 3:
        content = "模式三";
        break;
      case 4:
        content = "模式四";
        break;
      case 5:
        content = "模式五";
        break;
    }
  }
  document.getElementById("h3-show").innerHTML = content;
}

/**
 * 初始化
 * @param 畫面名稱 type
 */
function init(type) {
  try {
    clearInterval(totalInterval);
    clearInterval(qInterval);
  } catch (e) {
    // do nothing...
  }

  document.getElementById("btn-start").addEventListener("click", function () {
    start(type);
    show();
  });
  showH3();
}

function goSaveUser() {
  let savedUser = localStorage.getItem("savedUser");
  if (savedUser === null) {
    savedUser = [];
  } else {
    savedUser = JSON.parse(savedUser);
  }
  let currentUser = localStorage.getItem("currentUser");
  currentUser = JSON.parse(currentUser);
  savedUser.push(currentUser);
  console.log(savedUser);
  localStorage.setItem("savedUser", JSON.stringify(savedUser));
  localStorage.setItem("CURRENT_SEQUENCE", -1);
  localStorage.setItem("CURRENT_MODE", 1);
  localStorage.setItem("currentUser", JSON.stringify({}));
  window.location.href = "./index-stroop.html";
}

/**
 * 開始測驗
 * @param 畫面名稱 type
 */
function start() {
  START_TIME = new Date().getTime();
  // 改變畫面
  document.getElementById("startBlock").style.display = "none";
  document.getElementById("questionBlock").style.display = "block";
}

var failNumArray = [];
var failNum = 0;
/**
 * 計算得分
 * @param x
 * @param y
 */
function score(x, y) {
  if (x == y) {
    STROOP_TOTAL_QUESTION_NUM -= 1;
    if (STROOP_TOTAL_QUESTION_NUM) {
      failNumArray.push(failNum);
      failNum = 0;
      show();
    } else {
      finish("stroop");
    }
  } else {
    failNum += 1;
  }
}

/**
 * 結束測驗，顯示結果
 * @param 畫面名稱 type
 */
function finish(type) {
  // 改變畫面
  END_TIME = new Date().getTime();
  spendTime = (END_TIME - START_TIME) / 1000;

  document.getElementById("questionBlock").style.display = "none";
  document.getElementById("resultBlock").style.display = "block";
  document.getElementById("result").innerHTML = `
    共失誤 ${failNumArray.reduce((a, b) => a + b)} 次
    <br>
    花費 ${spendTime} 秒
  `;

  if (localStorage.getItem("currentUser") !== null) {
    // 儲存成績
    let currentUser = localStorage.getItem("currentUser");
    currentUser = JSON.parse(currentUser);
    currentUser.scores.push({
      mode: localStorage.getItem("CURRENT_MODE"),
      type: type,
      questionNum: localStorage.getItem("STROOP_TOTAL_QUESTION_NUM"),
      failNumArray: failNumArray,
      endTime: new Date().toLocaleString(),
      spendTime: spendTime,
    });
    localStorage.setItem("currentUser", JSON.stringify(currentUser));
  }
}

/**
 * 註冊
 */
function register() {
  if (el_inputName.value === "") {
    return false;
  } else {
    var formReg = document.forms["form-register"];

    localStorage.setItem(
      "currentUser",
      JSON.stringify({
        name: formReg.elements["input-name"].value,
        isPreTest: Boolean(formReg.elements["test1"].value),
        scores: [],
        testTime: new Date().toLocaleString(),
      })
    );
    localStorage.setItem("CURRENT_SEQUENCE", 0);
    localStorage.setItem("CURRENT_MODE", 1);
    registerModalInstance.close();
    window.location.href = "./stroop.html";
  }
}

//------------------------顯示題目------------------------
var COLOR_PREV = "";
var WORD_PREV = "";
var WORD2_PREV = "";

function getMode1Question() {
  while (true) {
    [q_num] = getRandomNumbers([0, 1, 2, 3], 1);
    if (WORD_PREV != WORD[q_num]) {
      break;
    }
  }

  WORD_PREV = WORD[q_num];
  CURRENT_QUESTION_NUM = q_num;
  return ["black", WORD[q_num]];
}

function getMode2Question() {
  while (true) {
    [q_num] = getRandomNumbers([0, 1, 2, 3], 1);
    if (COLOR_PREV != COLOR[q_num] && WORD_PREV != WORD[q_num]) {
      break;
    }
  }

  COLOR_PREV = COLOR[q_num];
  WORD_PREV = WORD[q_num];
  CURRENT_QUESTION_NUM = q_num;
  return [COLOR[q_num], WORD[q_num]];
}

function getMode3Question() {
  while (true) {
    [q_num] = getRandomNumbers([0, 1, 2, 3], 1);
    if (COLOR_PREV != COLOR[q_num]) {
      break;
    }
  }

  COLOR_PREV = COLOR[q_num];
  CURRENT_QUESTION_NUM = q_num;
  return [COLOR[q_num], ""];
}

function getMode4Question() {
  while (true) {
    [color_num, word_num] = getRandomNumbers([0, 1, 2, 3], 2);
    if (COLOR_PREV != COLOR[color_num] && WORD_PREV != WORD[word_num]) {
      break;
    }
  }

  COLOR_PREV = COLOR[color_num];
  WORD_PREV = WORD[word_num];
  CURRENT_QUESTION_NUM = color_num;
  return [COLOR[color_num], WORD[word_num]];
}

function getMode5Question() {
  while (true) {
    [color_num, word_num] = getRandomNumbers([0, 1, 2, 3], 2);
    if (COLOR_PREV != COLOR[color_num] && WORD2_PREV != WORD2[word_num]) {
      break;
    }
  }

  COLOR_PREV = COLOR[color_num];
  WORD_PREV = WORD2[word_num];
  CURRENT_QUESTION_NUM = color_num;
  return [COLOR[color_num], WORD2[word_num]];
}

function show() {
  let [color, word] = [];
  let innerHTML = "";

  switch (parseInt(localStorage.getItem("CURRENT_MODE"))) {
    case 1:
      [color, word] = getMode1Question();
      break;
    case 2:
      [color, word] = getMode2Question();
      break;
    case 4:
      [color, word] = getMode4Question();
      break;
    case 5:
      [color, word] = getMode5Question();
      break;
  }
  innerHTML = `
    <span id="color-question" class="${color}-text">
      ${word}
    </span>
  `;

  document.getElementById("div-question").innerHTML = innerHTML;

  if (parseInt(localStorage.getItem("CURRENT_MODE")) === 3) {
    [color, word] = getMode3Question();
    innerHTML = `
      <div class="row">
        <div class="col offset-s4 s4">
          <div class="card ${color}">
            <div class="card-content" style="height: 40vh;"></div>
          </div>
        </div>
      </div>
    `;
    document.getElementById("div-question").innerHTML = innerHTML;
  }
  console.log(color, word);
}

//------------------------點擊答案，計算分數並顯示新題目------------------------
function submitAns(x) {
  score(x, COLOR[CURRENT_QUESTION_NUM]);
}

// ---------------下載測驗結果---------------
document.getElementById("btn-download").addEventListener("click", function () {
  goSaveUser();
  download();
});

let el_STROOP_TOTAL_QUESTION_NUM = document.getElementById(
  "STROOP_TOTAL_QUESTION_NUM"
);
function loadSetting() {
  el_STROOP_TOTAL_QUESTION_NUM.value = localStorage.getItem(
    "STROOP_TOTAL_QUESTION_NUM"
  );
}

function saveSetting() {
  localStorage.setItem(
    "STROOP_TOTAL_QUESTION_NUM",
    el_STROOP_TOTAL_QUESTION_NUM.value
  );
  M.toast({ html: "儲存成功!" });
}
