type CellContent = HTMLElement | string;

interface RenderOption {
	isLastQ: boolean;
}

class Question{
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

	render(op: RenderOption) {
		clearQuestionPage();
		clevAppend(document.getElementById('header'), this.header);
		clevAppend(document.getElementById('pre-c'), this.pre);
		clevAppend(document.getElementById('post-c'), this.post);
		let nextMsg;
		if (op.isLastQ) {
			nextMsg = "回答を終える";
		} else {
			nextMsg = "次へ";
		}
		clevAppend(document.getElementById('next'), nextMsg);
	}
}

function clevAppend(node: HTMLElement, child: CellContent) {
	if (typeof child === "object" && child.nodeType === 1) {
		// assume child is a node
		return(node.appendChild(child));
	} else if (typeof child === 'string') {
		node.innerHTML = child;
		return node;
	}
}

function clearQuestionPage() {
	const  gridsToBeCleard: string[] = ["header", "pre-bar","post-bar", "next"];
	for (const id of gridsToBeCleard) {
		document.getElementById(id).textContent = "";
	}
	resetBar();
}

function resetBar() {
	let bar = document.getElementById('response');
	if (bar !== null) {
		(bar as HTMLInputElement).value = '0.5';
	}
}

