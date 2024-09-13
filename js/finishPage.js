const finishPage = new Flip("Thank You! タブレットを担当者に渡してください．", "", "");
function prepareFinishPage(q) {
    finishPage.basicRender("担当者はここからダウンロード");
    document.getElementById('centre').innerHTML = `
			<div class="center-image">
				<img src="https://live.staticflickr.com/778/20640894926_cdd2ccc266_n.jpg" alt="">
			</div>
	`;
    document.getElementById('next').onclick = () => downloadResult(q);
}
function downloadResult(q) {
    const partID = STORAGE.getItem("partID");
    const storedRes = STORAGE.getItem(q.runOption.dataStorageName);
    if (storedRes == null) {
        alert("多分質問を始めるページを経由してない");
        return 0;
    }
    const responses = JSON.parse(storedRes);
    const cur = new Date(); // current time
    const timeStamp = datetime_format(cur);
    const tsvLine = [timeStamp, partID, ...responses].join('\t');
    console.log(tsvLine);
    const blob = new Blob([tsvLine], { type: "text/tab-separated-values;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    let anch = document.createElement('a');
    anch.setAttribute('href', url);
    anch.setAttribute('download', [timeStamp, '-', partID, '.tsv'].join(''));
    anch.style.display = 'none';
    document.body.appendChild(anch);
    anch.click();
    document.body.removeChild(anch);
}
