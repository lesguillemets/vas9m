const STORAGE = sessionStorage;

type CellContent = HTMLElement | string;
type VasResponse = number | null;

class VasQuestion {
	// single questions
	header: CellContent;
	pre: CellContent;
	post: CellContent;
	constructor(header: CellContent, pre: CellContent, post: CellContent){
		// each of them is either string or a node/element
		this.header = header;
		this.pre = pre;
		this.post = post;
	}
}

class Questionnaire {
	// Think of this class as the paper you hand over to the participant
	qs: VasQuestion[];
	maxRepeat: number; // this quetionnaire will run n times

	constructor(q: VasQuestion[], maxRepeat:number) {
		this.qs = q;
		this.maxRepeat = maxRepeat;
	}

}

class Responses {
	// Where responses are saved;
	// for questions that are not yet answered, it will contain null.
	rs: VasResponse[][];
	constructor(maxQ: number, maxRepeat: number) {
		this.rs = [];
		for (let r = 0; r < maxRepeat; r++) {
			// unanswered answers are stored as null
			const runAns = Array.from({ length: maxQ }, (v, i) => null);
			this.rs.push(runAns);
		}
	}

	setRes(repeat:number, q:number, res:VasResponse): void{
		if (this.rs[repeat][q] !== null && res === null) {
			alert("overriding saved answer with null!?");
		}
		this.rs[repeat][q] = res;
	}

	saveToStorageWithKey(savedName: string): void {
		STORAGE.setItem(savedName, JSON.stringify(this.rs));
	}
}


class Runner {
	readonly textGrids: string[] = ["header", "pre-c", "post-c", "next"];
	readonly barId: string = "response";
	partId: string;
	qn: Questionnaire;
	rs: Responses;
	currentQ: number; // zero-indexed
	currentRepeat: number; // zero-indexed

	constructor(qn: Questionnaire, partId: string) {
		this.qn = qn;
		this.partId = partId;
		const responses = new Responses(qn.qs.length, qn.maxRepeat);
		this.rs = responses;
		this.currentQ = 0
		this.currentRepeat = 0;
	}
	resetBar(): void {
		// set bar tip to be in the centre, if the bar exists
		const bar = document.getElementById(this.barId);
		if (bar !== null) {
			(bar as HTMLInputElement).value = "0.5";
		}
	}
	clearPage(): void {
		for (const id of this.textGrids) {
			document.getElementById(id).textContent = "";
		}
		this.resetBar();
	}
	isLastQ(): boolean {
		return (this.currentQ === this.qn.qs.length-1);
	}
	isLastRepeat(): boolean {
		return (this.currentRepeat === this.qn.maxRepeat-1)
	}

	renderCurrentQ(): void {
		this.clearPage();
		const q : VasQuestion = this.qn.qs[this.currentQ];
		let nextMsg: string;
		if (this.isLastQ()) {
			nextMsg = "回答を終える";
		} else {
			nextMsg = "次へ";
		}
		clevAppend(document.getElementById('header'), q.header);
		clevAppend(document.getElementById('pre-c'), q.pre);
		clevAppend(document.getElementById('post-c'), q.post);
		clevAppend(document.getElementById('next'), nextMsg);
	}

	acceptRes(): number {
		// accept currently selected answer and save to this.rs
		const r = this.getRes();
		this.rs.setRes(this.currentRepeat, this.currentQ, r);
		return r;
	}

	getRes(): number {
		// FIXME really do we do this?
		const res = (document.getElementById("response") as HTMLInputElement).value;
		return +res;
	}
	initStorage(): boolean {
		if (sessionStorage.getItem("VAS9M_SAVE") !== null) {
			// sessionStorage contains something!
			alert("THERE IS STILL A SAVED DATA, WHICH WILL BE LOST!!!");
			return false;
		} else {
			return true;
		}
	}
	saveStatus() {
		// FIXME name
		STORAGE.setItem(
			"VAS9M_SAVE",
			JSON.stringify({
				partId: this.partId,
				currentQ: this.currentQ,
				currentRepeat: this.currentRepeat,
				rs: this.rs,
			}),
		);
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
		// FIXME clearPage();
		clevAppend(document.getElementById('header'), this.header);
		clevAppend(document.getElementById('pre-c'), this.pre);
		clevAppend(document.getElementById('post-c'), this.post);
		clevAppend(document.getElementById('next'), nextMsg);
	}
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
function initStorage(): boolean {
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
	// STORAGE.setItem(rop.dataStorageName, JSON.stringify(dat));
	return true;
}

/// preparing finish page

const finishPage: Flip = new Flip(
	"Thank You! タブレットを担当者に渡してください．",
	"",
	""
);
// 
// function downloadResult(q: Questionnaire) {
// 	const datStr = STORAGE.getItem(q.runOption.dataStorageName);
// 	if (datStr == null) {
// 		alert("多分質問を始めるページを経由してない: Storage 初期化未");
// 		return 0;
// 	}
// 	const dat = JSON.parse(datStr);
// 	const cur = new Date(); // current time
// 	const timeStamp = datetime_format(cur);
// 	const tsvLine = [timeStamp, dat.partID, ...dat.responses].join('\t');
// 	console.log(tsvLine);
// 	const blob = new Blob([tsvLine], {type: "text/tab-separated-values;charset=utf-8"})
// 	const url = URL.createObjectURL(blob);
// 	const anch = document.createElement('a');
// 	anch.setAttribute('href', url);
// 	anch.setAttribute('download', [timeStamp, '-', dat.partID, '.tsv'].join(''));
// 	anch.style.display = 'none';
// 	document.body.appendChild(anch);
// 	anch.click();
// 	document.body.removeChild(anch);
// }
// 
// function prepareFinishPage(q: Questionnaire) {
// 	finishPage.basicRender("担当者はここからダウンロード");
// 	document.getElementById('centre').innerHTML = `
// 			<div class="center-image">
// 				<img src="https://live.staticflickr.com/778/20640894926_cdd2ccc266_n.jpg" alt="">
// 			</div>
// 	`;
// 	document.getElementById('next').onclick =  () => {
// 		downloadResult(q);
// 		if (document.getElementById('restart') === null) {
// 			setRestart(q);
// 		}
// 	}
// }
// 
// function setRestart(q:Questionnaire) {
// 	const cell = document.getElementById('centre');
// 	const restartButton: HTMLButtonElement = document.createElement('button');
// 	restartButton.id = 'restart';
// 	restartButton.classList.add('button');
// 	if (q.isLastSeq()) {
// 		// Finished everything!
// 		restartButton.innerText = "結果のファイルは保存したので，回答をクリアして初期画面に戻る";
// 		restartButton.onclick = () => {
// 			const conf = confirm("この参加者の回答はこれで終わりです．\ntsv ファイルを保存しましたね？\n その他の場所からはデータが失われます");
// 			if (conf) {
// 				restartAll(q);
// 			}
// 		}
// 	} else {
// 		// finished this seq
// 		restartButton.innerText = "結果のファイルは保存したので，次の回答を受ける準備をする";
// 		restartButton.onclick = () => {
// 			alert("not yet implemented!");
// 		}
// 	}
// 	cell.appendChild(restartButton);
// }
// 
// function restartAll(q:Questionnaire) {
// 	console.log(STORAGE.getItem(q.runOption.dataStorageName));
// 	STORAGE.removeItem(q.runOption.dataStorageName);
// 	init(q.runOption);
// }
