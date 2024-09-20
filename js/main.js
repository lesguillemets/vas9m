function init(rop) {
    prepareStartPage();
    const questionnaire = new Questionnaire(theQuestions, rop);
    document.getElementById('next').onclick = () => {
        const initSuccess = initStorage(rop);
        if (initSuccess) {
            switchGridToQuestions();
            run(questionnaire);
        }
    };
}
window.addEventListener('load', () => init({ maxSequence: 1, dataStorageName: "VASResult" }));
