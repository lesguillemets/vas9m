
function run(q: Questionnaire) {
	// runs q.n-th question, in the q.seq-th sequence.
	if (q.n >= q.nQuestions) {
		// end of the sequence.
		console.log(q);
		console.log(STORAGE);
		if (q.seq+1 >= q.runOption.maxSequence) {
			// e.g. 0+1 >= 1 : end of the entire experiment
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
