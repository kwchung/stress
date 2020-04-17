let goCalc = function() {
  window.location.href = "/calc.html";
};

let goColor = function() {
  window.location.href = "/color.html";
};

let goSaveUser = function() {
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
  localStorage.setItem("currentUser", JSON.stringify({}));
  alert("測驗結束！");
  window.location.href = "/home.html";
};

let goRest = function() {
  window.location.href = "/rest.html";
};

// 執行順序
let SEQUENCE = [goColor, goCalc, goCalc, goRest, goColor, goSaveUser];

/**
 * 對 LocalStorage key 的 value 加一
 * @param {*} key localStorage key
 */
function addLocalStorage(key) {
  let val = parseInt(localStorage.getItem(key));
  val += 1;
  localStorage.setItem(key, val);
  return val;
}

/**
 * 讀取JSON
 * @param 檔案路徑 file
 * @param callback callback
 */
function loadJSON(file, callback) {
  let xobj = new XMLHttpRequest();
  xobj.overrideMimeType("application/json");
  xobj.open("GET", file, true);
  xobj.onreadystatechange = function() {
    if (xobj.readyState == 4 && xobj.status == "200") {
      callback(xobj.responseText);
    }
  };
  xobj.send(null);
}

function getRandom(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

var registerModalInstance, blackModalInstance, restModalInstance;
// ---------------彈出視窗(Modal)---------------
document.addEventListener("DOMContentLoaded", function() {
  let registerModal = document.getElementById("modal-register");
  let blackModal = document.getElementById("modal-black");
  let restModal = document.getElementById("modal-rest");
  registerModalInstance = M.Modal.init(registerModal, { opacity: 0.5 });
  blackModalInstance = M.Modal.init(blackModal, { opacity: 1 });
  restModalInstance = M.Modal.init(restModal, { opacity: 1 });
});

let el_inputName = document.getElementById("input-name");
el_inputName.addEventListener("keypress", function(e) {
  let key = e.which || e.keyCode;
  if (key === 13) {
    register();
  }
});

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
        testTime: new Date().toLocaleString()
      })
    );
    let current_sequence = 0;
    localStorage.setItem("CURRENT_SEQUENCE", current_sequence);
    let execFunc = SEQUENCE[current_sequence];
    registerModalInstance.close();
    execFunc();
  }
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
  document.getElementById("qTime").innerHTML = QUESTION_TIME;
  document.getElementById("btn-start").addEventListener("click", function() {
    start(type);
    show();
  });
  showH3();
}

function showH3() {
  let CURRENT_SEQUENCE = parseInt(localStorage.getItem("CURRENT_SEQUENCE"));
  let content = "";
  if (CURRENT_SEQUENCE == -1) {
    content = "練習";
  } else {
    content = "測驗 " + (CURRENT_SEQUENCE + 1);
  }
  document.getElementById("h3-show").innerHTML = content;
}

/**
 * 開始測驗
 * @param 畫面名稱 type
 */
function start(type) {
  // 改變畫面
  document.getElementById("startBlock").style.display = "none";
  document.getElementById("questionBlock").style.display = "block";

  myCountdown(type);
}

/**
 * 執行倒數計時
 * @param 畫面名稱 type
 */
function myCountdown(type) {
  //------------------------總時間---------------------
  let countdown = TOTAL_TIME;
  let totalInterval = setInterval(function() {
    countdown = totalTimer(countdown);
    if (countdown == 0) {
      clearInterval(totalInterval);
      clearInterval(qInterval);
      finish(type);
    }
  }, 1000);

  //------------------------每題時間---------------------
  let qInterval = setInterval(function() {
    qTimer();
  }, 1000);
}

/**
 * 總時間倒數
 * @param 目前的倒數時間 _total
 */
function totalTimer(_total) {
  _total -= 1;
  document.getElementById("div-countdown").style.width =
    (_total / TOTAL_TIME) * 100 + "%";
  return _total;
}

/**
 * 每題時間倒數
 */
function qTimer() {
  let _q = parseInt(document.getElementById("qTime").innerHTML);
  if (_q > 1) {
    document.getElementById("qTime").innerHTML = _q - 1;
  } else {
    CURRENT_QUESTION_NUM += 1;
    document.getElementById("qTime").innerHTML = QUESTION_TIME;
    show();
    // 超時就算答錯
    falseScore += 1;
  }
}

/**
 * 結束測驗，顯示結果
 * @param 畫面名稱 type
 */
function finish(type) {
  // 改變畫面
  document.getElementById("questionBlock").style.display = "none";
  document.getElementById("resultBlock").style.display = "block";
  document.getElementById("result").innerHTML = `
    ${trueScore} / ${trueScore + falseScore}
  `;

  if (localStorage.getItem("currentUser") !== null) {
    // 開啟、關閉黑屏
    setTimeout(function() {
      blackModalInstance.open();
      // 儲存成績
      let currentUser = localStorage.getItem("currentUser");
      currentUser = JSON.parse(currentUser);
      currentUser.scores.push({
        type: type,
        trueScore: trueScore,
        falseScore: falseScore,
        endTime: new Date().toLocaleString()
      });
      localStorage.setItem("currentUser", JSON.stringify(currentUser));
    }, 1000);

    setTimeout(function() {
      // 前往下一題
      let current_sequence = addLocalStorage("CURRENT_SEQUENCE");
      let execFunc = SEQUENCE[current_sequence];
      execFunc();
    }, 20000);
  }
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
  } else {
    falseScore += 1;
  }
}

// ---------------下載測驗結果---------------
document.getElementById("btn-download").addEventListener("click", function() {
  if (localStorage.getItem("savedUser") === null) {
    alert("測驗尚未完成！");
    return false;
  }
  // 取出目前使用者成績
  let savedUser = localStorage.getItem("savedUser");
  // 取出歷史紀錄
  loadJSON("rank.json", function(response) {
    let data = JSON.parse(response);

    // 將目前使用者成績加入歷史紀錄
    savedUser = JSON.parse(savedUser);
    savedUser.forEach((user, index, arr) => {
      data.push(user);
    });

    data = JSON.stringify(data);

    // 存檔
    let pom = document.createElement("a");
    pom.setAttribute(
      "href",
      "data:application/json;charset=utf-8," + encodeURIComponent(data)
    );
    pom.setAttribute("download", "rank.json");

    if (document.createEvent) {
      let event = document.createEvent("MouseEvents");
      event.initEvent("click", true, true);
      pom.dispatchEvent(event);
    } else {
      pom.click();
    }
  });
  localStorage.clear();
});
