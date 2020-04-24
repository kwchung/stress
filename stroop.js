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

  document
    .getElementById("btn-start-mode1")
    .addEventListener("click", function () {
      CURRENT_MODDE = 1;
      start(type);
      show();
    });
  document
    .getElementById("btn-start-mode2")
    .addEventListener("click", function () {
      CURRENT_MODDE = 2;
      start(type);
      show();
    });
  document
    .getElementById("btn-start-mode3")
    .addEventListener("click", function () {
      CURRENT_MODDE = 3;
      start(type);
      show();
    });
  showH3();
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

var trueScore = 0;
var falseScore = 0;
/**
 * 計算得分
 * @param x
 * @param y
 */
function score(x, y) {
  if (x == y) {
    trueScore += 1;
    TOTAL_QUESTION_NUM -= 1;
    if (TOTAL_QUESTION_NUM) {
      show();
    } else {
      finish("stroop");
    }
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
    ${trueScore} / ${trueScore + falseScore}
    <br>
    ${spendTime} sec
  `;

  if (localStorage.getItem("currentUser") !== null) {
    // 儲存成績
    let currentUser = localStorage.getItem("currentUser");
    currentUser = JSON.parse(currentUser);
    currentUser.scores.push({
      mode: CURRENT_MODDE,
      type: type,
      trueScore: trueScore,
      falseScore: falseScore,
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
    localStorage.setItem(
      "currentUser",
      JSON.stringify({
        name: el_inputName.value,
        scores: [],
        testTime: new Date().toLocaleString(),
      })
    );
    let current_sequence = 0;
    localStorage.setItem("CURRENT_SEQUENCE", current_sequence);
    registerModalInstance.close();
  }
}
