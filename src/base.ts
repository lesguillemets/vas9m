const STORAGE = sessionStorage;
type CellContent = HTMLElement | string;

interface RunOption {
	maxSequence: number;
	dataStorageName: string;
}

interface RenderOption {
	isLastQ: boolean;
}

function clearPage() {
	const  gridsToBeCleard: string[] = ["header", "pre-c","post-c", "next"];
	for (const id of gridsToBeCleard) {
		document.getElementById(id).textContent = "";
	}
	resetBar();
}

function resetBar() {
	const bar = document.getElementById('response');
	if (bar !== null) {
		(bar as HTMLInputElement).value = '0.5';
	}
}

class Flip{
	header: CellContent;
	pre: CellContent;
	post: CellContent;
	// Design decision: questions themselves have no influence over the
	// innerText for the bottom button. For example it will simply be
	// 'next' every time.
	// nextMsg: CellContent;

	constructor(header: CellContent, pre: CellContent, post: CellContent){
		// each of them is either string or a node/element
		this.header = header;
		this.pre = pre;
		this.post = post;
		// this.nextMsg = nextMsg;
	}
	basicRender(nextMsg:CellContent) {
		// clears the page and renders header, pre, post.
		// nextMsg is, currently, assumed to be context-dependent,
		// so it is something this function explicitly receives
		clearPage();
		clevAppend(document.getElementById('header'), this.header);
		clevAppend(document.getElementById('pre-c'), this.pre);
		clevAppend(document.getElementById('post-c'), this.post);
		clevAppend(document.getElementById('next'), nextMsg);
	}
}

class Question extends Flip {
	render(op: RenderOption) {
		let nextMsg: string;
		if (op.isLastQ) {
			nextMsg = "回答を終える";
		} else {
			nextMsg = "次へ";
		}
		this.basicRender(nextMsg);
	}
}

class Questionnaire {
	qs: Question[];
	n: number;
	nQuestions: number;
	seq: number;
	runOption: RunOption;

	constructor(qs: Question[], runOption: RunOption) {
		this.qs = qs;
		this.n = 0;
		this.nQuestions = qs.length;
		this.seq = 0;
		this.runOption = runOption;
	}

	isLastSeq(): boolean {
		// e.g. 0+1 >= 1 : end of the entire experiment
		return (this.seq +1 === this.runOption.maxSequence);
	}

}

function run(q: Questionnaire) {
	// runs q.n-th question, in the q.seq-th sequence.
	if (q.n >= q.nQuestions) {
		// end of the sequence.
		console.log(q);
		console.log(STORAGE);
		if (q.isLastSeq()) {
			console.log("end; download;");
			prepareFinishPage(q);
		} else {
			// continue to next sequence
			alert("sequence finished; dowload; prepare next");
		}
	} else {
		// let's ask the n-th question!
		const isLastQ: boolean = (q.n+1 === q.nQuestions);
		q.qs[q.n].render({'isLastQ': isLastQ});
		document.getElementById('next').onclick = () => {
			gatherResponse(q.n, q.runOption.dataStorageName);
			q.n += 1;
			run(q);
		}
	}
}
function gatherResponse(i: number, savedName: string): string {
	const res = (document.getElementById('response') as HTMLInputElement).value;
	const storedRes = STORAGE.getItem(savedName);
	if (storedRes == null) {
		alert("多分質問を始めるページを経由してない : STORAGE の初期化が未");
		return "";
	}
	const dat = JSON.parse(storedRes);
	if (dat.responses.length !== i) { console.log("ERROR? maybe wrong number of responses "+ dat.responses);}
	dat.responses.push(res);
	STORAGE.setItem(savedName, JSON.stringify(dat));
	return res;
}



/// preparing start page
//
const startPage: Flip = new Flip(
	"よろしくおねがいします",
	"",
	""
);

function prepareStartPage() {
	startPage.basicRender("回答を始める");
	// FIXME I know, I don't want it
	document.getElementById('centre').innerHTML = `
	<label class="weaktext" for="participantID">参加者ID</label>
		<input type="text" size="7" placeholder="IDを入力" spellcheck="false" autocorrect="off" id="participantID">
	`;
}

/// preparing question pages
function switchGridToQuestions() {
	// parepare input[type=range] into #centre
	const rangeInput = document.createElement('input');
	rangeInput.type = "range";
	rangeInput.id = 'response';
	rangeInput.classList.add('range-bar');
	rangeInput.min = "0";
	rangeInput.max = "1";
	rangeInput.step = "any";
	const cell = document.getElementById('centre');
	cell.innerText = "";
	cell.appendChild(rangeInput);
}
function initStorage(rop:RunOption): boolean {
	// start receiving question
	const partID = (document.getElementById('participantID') as HTMLInputElement).value;
	if (partID === '') {
		alert("no id specified: try again");
		return false;
	}
	const responses = [];
	const dat = { 'partID' : partID, 'responses': responses };
	// For plain objects and arrays, you can use JSON.stringify().
	// https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API/Using_the_Web_Storage_API
	STORAGE.setItem(rop.dataStorageName, JSON.stringify(dat));
	return true;
}

/// preparing finish page

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
	const anch = document.createElement('a');
	anch.setAttribute('href', url);
	anch.setAttribute('download', [timeStamp, '-', dat.partID, '.tsv'].join(''));
	anch.style.display = 'none';
	document.body.appendChild(anch);
	anch.click();
	document.body.removeChild(anch);
}

function prepareFinishPage(q: Questionnaire) {
	finishPage.basicRender("担当者はここからダウンロード");
	document.getElementById('centre').innerHTML = `
			<div class="center-image">
				<img src="https://live.staticflickr.com/778/20640894926_cdd2ccc266_n.jpg" alt="">
			</div>
	`;
	document.getElementById('next').onclick =  () => {
		downloadResult(q);
		if (document.getElementById('restart') === null) {
			setRestart(q);
		}
	}
}

function setRestart(q:Questionnaire) {
	const cell = document.getElementById('centre');
	const restartButton: HTMLButtonElement = document.createElement('button');
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
		}
	} else {
		// finished this seq
		restartButton.innerText = "結果のファイルは保存したので，次の回答を受ける準備をする";
		restartButton.onclick = () => {
			alert("not yet implemented!");
		}
	}
	cell.appendChild(restartButton);
}

function restartAll(q:Questionnaire) {
	console.log(STORAGE.getItem(q.runOption.dataStorageName));
	STORAGE.removeItem(q.runOption.dataStorageName);
	init(q.runOption);
}
