type CellContent = HTMLElement | string;

interface RenderOption {
	isLastQ: boolean;
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

function clevAppend(node: HTMLElement, child: CellContent) {
	if (typeof child === "object" && child.nodeType === 1) {
		// assume child is a node
		return(node.appendChild(child));
	} else if (typeof child === 'string') {
		node.innerHTML = child;
		return node;
	}
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

