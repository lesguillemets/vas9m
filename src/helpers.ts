
function toTwoDigits(n:number): string {
	// n : integer, returnd 01..99
	const s = String(n).padStart(2,'0');
	return s;
}

function datetime_format(d: Date): string{
	// hhmmss
	const timestr = [
		toTwoDigits(d.getHours()),
		toTwoDigits(d.getMinutes()),
		toTwoDigits(d.getSeconds())
	].join('');
	// 2024-09-23-103312
	const formatted = [
		d.getFullYear(),
		toTwoDigits(d.getMonth()+1),
		toTwoDigits(d.getDate()),
		timestr
	].join('-');
	return formatted;
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
