function init(rop : RunOption){
	prepareStartPage();
	document.getElementById('next').onclick = () => {
		const initSuccess = initStorage(rop);
		if (initSuccess) {
			switchGridToQuestions();
			run(theQuestions, rop, 0, 0)
		}
	}
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

function initStorage(rop:RunOption) {
	// start receiving question
	const partID = (document.getElementById('participantID') as HTMLInputElement).value;
	if (partID === '') {
		alert("no id specified: try again");
		return false;
	}
	const responses = [];
	STORAGE.setItem("partID", partID);
	// For plain objects and arrays, you can use JSON.stringify().
	// https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API/Using_the_Web_Storage_API
	STORAGE.setItem(rop.dataStorageName, JSON.stringify(responses));
	return true;
}

window.addEventListener('load', () => init({maxSequence:1, dataStorageName: "VACResult"}));
