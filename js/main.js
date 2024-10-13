function init(maxRepeat) {
    prepareRegisterPage();
    const questionnaire = new Questionnaire(theQuestions, maxRepeat);
    document.getElementById('next').onclick = () => {
        const partId = document.getElementById('participantID').value;
        if (partId === '') {
            alert("IDを指定してください");
            return false;
        }
        let runner = new Runner(questionnaire, partId);
        const initSuccess = runner.initStorage();
        if (initSuccess) {
            runner.startRepeat();
        }
    };
}
window.addEventListener('load', () => init(2));
