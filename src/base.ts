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

	startRepeat(): void{
		if (this.currentQ !== 0) {
			alert("startRepeat is called but currentQ is not Zero\n This is unexpected");
		}
		switchGridToNone();
		this.appendHeader(`指示されたタイミングで回答を開始してください(${this.currentRepeat+1}/${this.qn.maxRepeat})`);
		this.setButtonTitle("クリックして回答を開始する")
		document.getElementById('next').onclick = () => {
			switchGridToQuestions();
			this.saveStatus();
			this.runStep();
		}
	}
	runStep(): void {
		this.clearPage();
		this.renderCurrentQ();
		if (! (this.isLastQ())) {
			// there is still next question available
			document.getElementById('next').onclick = () => {
				console.log(this.acceptRes());
				this.saveStatus();
				this.currentQ += 1;
				this.runStep();
			};
		} else {
			// last question on sequence has been answered
			document.getElementById('next').onclick = () => {
				console.log(this.acceptRes());
				this.saveStatus();
				this.endRepeat();
			}
		}
	}

	endRepeat(): void {
		// called when the next button on the last question on sequence
		// is clicked.
		this.saveStatus();
		if (!(this.isLastRepeat())) {
			// there is another round you'll be answering
			this.currentQ = 0;
			this.currentRepeat += 1;
			this.clearPage();
			switchGridToNone();
			this.appendHeader("回答はおしまいです");
			this.setButtonTitle("クリックして回答を終了");
			document.getElementById('next').onclick = () => {
				alert("入力お疲れ様でした．\n OK を押した後，タブレットを置いて実験に戻ってください．")
				this.startRepeat();
			}
		} else {
			// end of last repeat
			this.prepareDownload();
		}
	}

	prepareDownload():void {
		alert("お疲れ様でした\nこれで回答は終わりです．タブレットはそのままにしてください．");
		switchGridToNone();
		this.clearPage();
		this.appendHeader("結果のダウンロード");
		this.setButtonTitle('担当者はここからダウンロード');
		document.getElementById('centre').innerHTML = `
		<div class="center-image">
		<img src="https://live.staticflickr.com/778/20640894926_cdd2ccc266_n.jpg" alt="">
			</div>
		`;
		document.getElementById('next').onclick =  () => {
			downloadResult(this);
		}
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
				rs: this.rs.rs,
			}),
		);
	}

	appendHeader(msg: CellContent): void {
		clevAppend(document.getElementById('header'), msg);
	}
	setButtonTitle(msg: string): void{
		document.getElementById('next').innerHTML = msg;
	}
}

function downloadResult(r: Runner) {
	// FIXME name
	const datStr = STORAGE.getItem("VAS9M_SAVE");
	if (datStr == null) {
		alert("多分質問を始めるページを経由してない: Storage 初期化未");
		return 0;
	}
	const dat = JSON.parse(datStr);
	const cur = new Date(); // current time
	const timeStamp = datetime_format(cur);
	const tsvLine = [timeStamp, dat.partId, ...dat.rs.flat()].join('\t');
	console.log(tsvLine);
	const blob = new Blob([tsvLine], {type: "text/tab-separated-values;charset=utf-8"})
	const url = URL.createObjectURL(blob);
	const anch = document.createElement('a');
	anch.setAttribute('href', url);
	anch.setAttribute('download', [timeStamp, '-', dat.partId, '.tsv'].join(''));
	anch.style.display = 'none';
	document.body.appendChild(anch);
	anch.click();
	document.body.removeChild(anch);
}

function prepareRegisterPage() {
	clevAppend(document.getElementById('header'), "参加者IDの設定");
	clevAppend(document.getElementById('next'), "回答画面へ");
	// FIXME I know, I don't want it
	document.getElementById('centre').innerHTML = `
	<label class="weaktext" for="participantID">参加者ID</label>
		<input type="text" size="7" placeholder="IDを入力" spellcheck="false" autocorrect="off" id="participantID">
	`;
}

/// preparing question pages
function switchGridToQuestions(): void {
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

function switchGridToNone(): void {
	const cell = document.getElementById('centre');
	cell.innerText = "";
}
