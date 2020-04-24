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
  // 取出歷史紀錄
  loadJSON("rank.json", function (response) {
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
  // localStorage.clear();
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
