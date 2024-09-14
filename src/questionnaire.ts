class Questionnaire {
	qs: Question[];
	n: number;
	nQuestions: number;
	seq: number;
	runOption: RunOption;

	constructor(qs: Question[], runOption: RunOption) {
		this.qs = qs;
		this.n = 0;
		this.nQuestions = qs.length;
		this.seq = 0;
		this.runOption = runOption;
	}

	isLastSeq(): boolean {
		// e.g. 0+1 >= 1 : end of the entire experiment
		return (this.seq +1 === this.runOption.maxSequence);
	}

}
