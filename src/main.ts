function init(maxRepeat: number) {
	const questionnaire = new Questionnaire(theQuestions, maxRepeat);
	const saved: Runner | null = Runner.tryLoadStatus(questionnaire);
	// there's a saved progress!
	if (saved !== null) {
		// seems to be finished;
		if (saved.seemsFinished()) {
			const ok = confirm(
				`前回の記憶が残っていますが，多分無事終了している分です．\n ID: ${saved.partId}\n: 消去して新しく始めてよいですか？`,
			);
			if (ok) {
				Runner.removeSave();
			} else {
				alert("では，ダウンロードのページに移ってみます…");
				saved.prepareDownload();
				return;
			}
		} else {
			// there's a saved progress, and it is midway
			alert("途中のデータがのこっているので，読み込んではじめてみます．");
			switchGridToQuestions();
			saved.runStep();
			return;
		}
	}
	// ここに残るのは，データ消去したか，初めてのケース．
	// ちょっと流れが変で気になりますね…．
	prepareRegisterPage();
	document.getElementById("next")!.onclick = () => {
		const partId = (
			document.getElementById("participantID") as HTMLInputElement
		).value;
		if (partId === "") {
			alert("IDを指定してください");
			return false;
		}
		const runner = new Runner(questionnaire, partId);
		const initSuccess = runner.initStorage();
		if (initSuccess) {
			runner.startRepeat();
		}
	};
}

window.addEventListener("load", () => init(4));
