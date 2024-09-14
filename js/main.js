function init(rop) {
    prepareStartPage();
    let questionnaire = new Questionnaire(theQuestions, rop);
    document.getElementById('next').onclick = () => {
        const initSuccess = initStorage(rop);
        if (initSuccess) {
            switchGridToQuestions();
            run(questionnaire);
        }
    };
}
function switchGridToQuestions() {
    // parepare input[type=range] into #centre
    let rangeInput = document.createElement('input');
    rangeInput.type = "range";
    rangeInput.id = 'response';
    rangeInput.classList.add('range-bar');
    rangeInput.min = "0";
    rangeInput.max = "1";
    rangeInput.step = "any";
    let cell = document.getElementById('centre');
    cell.innerText = "";
    cell.appendChild(rangeInput);
}
function initStorage(rop) {
    // start receiving question
    const partID = document.getElementById('participantID').value;
    if (partID === '') {
        alert("no id specified: try again");
        return false;
    }
    const responses = [];
    let dat = { 'partID': partID, 'responses': responses };
    // For plain objects and arrays, you can use JSON.stringify().
    // https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API/Using_the_Web_Storage_API
    STORAGE.setItem(rop.dataStorageName, JSON.stringify(dat));
    return true;
}
window.addEventListener('load', () => init({ maxSequence: 1, dataStorageName: "VASResult" }));
function prepareFinishPage(q) {
    finishPage.basicRender("担当者はここからダウンロード");
    document.getElementById('centre').innerHTML = `
			<div class="center-image">
				<img src="https://live.staticflickr.com/778/20640894926_cdd2ccc266_n.jpg" alt="">
			</div>
	`;
    document.getElementById('next').onclick = () => {
        downloadResult(q);
        if (document.getElementById('restart') === null) {
            setRestart(q);
        }
    };
}
function setRestart(q) {
    let cell = document.getElementById('centre');
    let restartButton = document.createElement('button');
    restartButton.id = 'restart';
    restartButton.classList.add('button');
    if (q.isLastSeq()) {
        // Finished everything!
        restartButton.innerText = "結果のファイルは保存したので，回答をクリアして初期画面に戻る";
        restartButton.onclick = () => {
            const conf = confirm("この参加者の回答はこれで終わりです．\ntsv ファイルを保存しましたね？\n その他の場所からはデータが失われます");
            if (conf) {
                restartAll(q);
            }
        };
    }
    else {
        // finished this seq
        restartButton.innerText = "結果のファイルは保存したので，次の回答を受ける準備をする";
        restartButton.onclick = () => {
            alert("not yet implemented!");
        };
    }
    cell.appendChild(restartButton);
}
function restartAll(q) {
    console.log(STORAGE.getItem(q.runOption.dataStorageName));
    STORAGE.removeItem(q.runOption.dataStorageName);
    init(q.runOption);
}
