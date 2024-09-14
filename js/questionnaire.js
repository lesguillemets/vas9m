class Questionnaire {
    constructor(qs, runOption) {
        this.qs = qs;
        this.n = 0;
        this.nQuestions = qs.length;
        this.seq = 0;
        this.runOption = runOption;
    }
    isLastSeq() {
        // e.g. 0+1 >= 1 : end of the entire experiment
        return (this.seq + 1 === this.runOption.maxSequence);
    }
}
