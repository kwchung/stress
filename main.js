/**
 * 讀取JSON
 * @param 檔案路徑 file
 * @param callback callback
 */
function loadJSON(file, callback) {
  let xobj = new XMLHttpRequest();
  xobj.overrideMimeType("application/json");
  xobj.open("GET", file, true);
  xobj.onreadystatechange = function () {
    if (xobj.readyState == 4 && xobj.status == "200") {
      callback(xobj.responseText);
    }
  };
  xobj.send(null);
}

function getRandomNumbers(candidates = [], amount = 0) {
  if (candidates.length < amount) return;
  // 複製一份所有選項
  let _candidates = candidates;
  // 最終結果
  let result = [];
  // 當還沒選到你要的數量就繼續
  while (result.length < amount) {
    // 從現有選項的數量中，隨機取得一個 index 值
    // 第一次會是 0~3，第二次會是 0~2
    let randomIndex = Math.floor(Math.random() * _candidates.length);
    // 把選到的 index 對應的選項推進最終結果
    result.push(_candidates[randomIndex]);
    // 從選項中把選到的移除
    _candidates.splice(randomIndex, 1);
  }
  // 回傳最終結果
  return result;
}

function download() {
  // 取出目前使用者成績
  let savedUser = localStorage.getItem("savedUser");

  // 存檔
  let pom = document.createElement("a");
  pom.setAttribute(
    "href",
    "data:application/json;charset=utf-8," + encodeURIComponent(savedUser)
  );
  pom.setAttribute("download", "rank.json");

  if (document.createEvent) {
    let event = document.createEvent("MouseEvents");
    event.initEvent("click", true, true);
    pom.dispatchEvent(event);
  } else {
    pom.click();
  }
  // localStorage.clear();
}

function resetLocalStorage() {
  localStorage.clear();
  localStorage.setItem("CURRENT_SEQUENCE", -1);
  localStorage.setItem("CURRENT_MODE", 1);
  localStorage.setItem("STROOP_TOTAL_QUESTION_NUM", 20);
  localStorage.setItem("STRESS_COLOR_TOTAL_TIME", 30);
  localStorage.setItem("STRESS_COLOR_QUESTION_TIME", 3);
  localStorage.setItem("STRESS_CALC_TOTAL_TIME", 30);
  localStorage.setItem("STRESS_CALC_QUESTION_TIME", 5);
  localStorage.setItem("STRESS_REST_TIME", 30);
  localStorage.setItem("STRESS_STOP_TIME", 20);
}

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
 * 對 LocalStorage key 的 value 加一
 * @param {*} key localStorage key
 */
function minusLocalStorage(key) {
  let val = parseInt(localStorage.getItem(key));
  val -= 1;
  localStorage.setItem(key, val);
  return val;
}
