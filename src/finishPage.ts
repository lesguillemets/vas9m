const finishPage: Flip = new Flip(
	"Thank You! タブレットを担当者に渡してください．",
	"",
	""
);

function downloadResult(q: Questionnaire) {
	const datStr = STORAGE.getItem(q.runOption.dataStorageName);
	if (datStr == null) {
		alert("多分質問を始めるページを経由してない: Storage 初期化未");
		return 0;
	}
	const dat = JSON.parse(datStr);
	const cur = new Date(); // current time
	const timeStamp = datetime_format(cur);
	const tsvLine = [timeStamp, dat.partID, ...dat.responses].join('\t');
	console.log(tsvLine);
	const blob = new Blob([tsvLine], {type: "text/tab-separated-values;charset=utf-8"})
	const url = URL.createObjectURL(blob);
	let anch = document.createElement('a');
	anch.setAttribute('href', url);
	anch.setAttribute('download', [timeStamp, '-', dat.partID, '.tsv'].join(''));
	anch.style.display = 'none';
	document.body.appendChild(anch);
	anch.click();
	document.body.removeChild(anch);
}

