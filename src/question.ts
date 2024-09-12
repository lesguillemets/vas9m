
class Question{
	constructor(header, pre, post, next){
		// each of them is either string or a node/element
		this.header = header;
		this.pre = pre;
		this.post = post;
		this.next = next;
	}

	render() {
		clearQuestionPage();
		clevAppend(document.getElementById('header'), this.header);
		clevAppend(document.getElementById('pre-c'), this.pre);
		clevAppend(document.getElementById('post-c'), this.post);
		clevAppend(document.getElementById('next'), this.next);
	}
}

function clevAppend(node, child) {
	if (typeof child === "object" && child.nodeType===1) {
		// assume child is a node
		return(node.appendChild(child));
	} else if (typeof child === 'string') {
		node.innerHTML = child;
		return node;
	}
}

