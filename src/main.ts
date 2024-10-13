function init(maxRepeat: number){
	prepareStartPage();
	const questionnaire = new Questionnaire(theQuestions, maxRepeat);
	document.getElementById('next').onclick = () => {
		const partId = (document.getElementById('participantID') as HTMLInputElement).value;
		if (partId === '') {
			alert("IDを指定してください");
			return false;
		}
		let runner = new Runner(questionnaire, partId);
		const initSuccess = runner.initStorage();
		if (initSuccess) {
			switchGridToQuestions();
			// run(questionnaire);
		}
	}
}


window.addEventListener('load', () => init(3));
