
function run(questions: Question[], rop: RunOption, n: number, seq:number) {
	// runs n-th question, in the seq-th sequence.
	if (n >= questions.length) {
		// end of the sequence.
		if (seq+1 >= rop.maxSequence) {
			// e.g. 0+1 >= 1 : end of the entire experiment
			alert("end; download;");
		} else {
			// continue to next sequence
			alert("sequence finished; dowload; prepare next");
		}
	} else {
		// let's ask the n-th question!
		questions[n].render({'isLastQ': false});
		document.getElementById('next').onclick = () => {
			gatherResponse(n, rop.dataStorageName);
			run(questions, rop, n+1, seq);
		}
	}
}

function gatherResponse(i: number, savedName: string) {
	const res = (document.getElementById('response') as HTMLInputElement).value;
	const storedRes = STORAGE.getItem(savedName);
	if (storedRes == null) {
		alert("多分質問を始めるページを経由してない");
		return 0;
	}
	let responses = JSON.parse(storedRes);
	if (responses.length !== i) { console.log("ERROR? maybe wrong number of responses "+ responses);}
	responses.push(res);
	STORAGE.setItem(savedName, JSON.stringify(responses));
	return res;
}
