/* ============================
   ペルソナ風 EXP / レベルシステム
   （ゲームの心臓部分）
============================ */

let player = {
    level: 1,     // 現在のレベル
    exp: 0,       // 現在の経験値
    nextExp: 100, // 次のレベルまでの必要EXP

    // ▼ステータス（初期値）
    str: 0, // ちから
    int: 0, // ちしき
    vit: 0, // たいりょく
    luk: 0  // うん
};

// EXPを増やす関数（タスク追加・完了で呼ぶ）
function addExp(amount) {
    player.exp += amount;   // 経験値を加算
    updateExpUI();          // 画面のEXPバー更新

    if (player.exp >= player.nextExp) {
        levelUp();          // 必要EXPを超えたらレベルアップ
    }
}

// レベルアップ処理
function levelUp() {
    player.level++;                     // レベルを1上げる
    player.exp = player.exp - player.nextExp; // 余ったEXPを次に持ち越し
    player.nextExp = Math.floor(player.nextExp * 1.3); // 必要EXPを増やす

    showLevelUpCutin();   // ペルソナ風カットイン演出
    updateExpUI();        // UI更新
}

// EXPバーとレベル表示を更新
function updateExpUI() {
    const expBar = document.getElementById("exp-bar");
    const levelText = document.getElementById("level-text");

    const percent = (player.exp / player.nextExp) * 100; // 進捗率
    expBar.style.width = percent + "%";                  // バーの長さ更新
    levelText.textContent = "Lv " + player.level;        // レベル表示更新
}

// レベルアップ演出（黒×赤のペルソナ風）
function showLevelUpCutin() {
    const cutin = document.getElementById("levelup-cutin");
    cutin.classList.add("show");

    setTimeout(() => {
        cutin.classList.remove("show");
    }, 2000);
}

function updateStatsUI() {
    document.getElementById("stat-str").textContent = player.str;
    document.getElementById("stat-int").textContent = player.int;
    document.getElementById("stat-vit").textContent = player.vit;
    document.getElementById("stat-luk").textContent = player.luk;
}

/* ============================
   タスク管理システム
============================ */

// HTML要素の取得
const taskInput = document.getElementById("task-input");
const addTaskBtn = document.getElementById("add-task");
const taskList = document.getElementById("task-list");
const messageBox = document.getElementById("message-box");
const categorySelect = document.getElementById("task-category");

// ページ読み込み時に保存されたタスクを復元
loadTasks();

// タスク追加ボタンを押した時の処理
addTaskBtn.addEventListener("click", () => {
    const text = taskInput.value.trim();
    if (text === "") return; // 空なら追加しない

    const category = categorySelect.value; // ← カテゴリ取得

    const task = document.createElement("div");
    task.textContent = text;

    // ▼カテゴリに応じてステータス加算
    if (category === "str") player.str++;
    if (category === "int") player.int++;
    if (category === "vit") player.vit++;
    if (category === "luk") player.luk++;

    updateStatsUI(); // ← ステータス表示更新

    // タスクをクリックしたら完了扱い
    task.addEventListener("click", () => {
        task.remove();
        showMessage("タスク完了、お疲れさま。");

        addExp(30); // タスク完了 → EXP +30
        saveTasks();
    });

    taskList.appendChild(task);
    taskInput.value = "";

    addExp(10); // タスク追加 → EXP +10
    saveTasks();
});

// メッセージ表示
function showMessage(msg) {
    messageBox.textContent = msg;
}

// タスクを保存（localStorage）
function saveTasks() {
    const tasks = [];
    document.querySelectorAll("#task-list div").forEach(task => {
        tasks.push(task.textContent);
    });
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// 保存されたタスクを読み込む
function loadTasks() {
    const saved = JSON.parse(localStorage.getItem("tasks") || "[]");

    saved.forEach(text => {
        const task = document.createElement("div");
        task.textContent = text;

        task.addEventListener("click", () => {
            task.remove();
            showMessage("タスク完了、お疲れさま。");

            addExp(30); // 読み込んだタスクにもEXP処理を付ける
            saveTasks();
        });

        taskList.appendChild(task);
    });
}

// 🔥 ページ読み込み時にEXPバーを初期表示
updateExpUI();
updateStatsUI();

