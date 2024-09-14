function run(q) {
    // runs q.n-th question, in the q.seq-th sequence.
    if (q.n >= q.nQuestions) {
        // end of the sequence.
        console.log(q);
        console.log(STORAGE);
        if (q.isLastSeq()) {
            console.log("end; download;");
            prepareFinishPage(q);
        }
        else {
            // continue to next sequence
            alert("sequence finished; dowload; prepare next");
        }
    }
    else {
        // let's ask the n-th question!
        const isLastQ = (q.n + 1 === q.nQuestions);
        q.qs[q.n].render({ 'isLastQ': isLastQ });
        document.getElementById('next').onclick = () => {
            gatherResponse(q.n, q.runOption.dataStorageName);
            q.n += 1;
            run(q);
        };
    }
}
function gatherResponse(i, savedName) {
    const res = document.getElementById('response').value;
    const storedRes = STORAGE.getItem(savedName);
    if (storedRes == null) {
        alert("多分質問を始めるページを経由してない : STORAGE の初期化が未");
        return "";
    }
    let dat = JSON.parse(storedRes);
    if (dat.responses.length !== i) {
        console.log("ERROR? maybe wrong number of responses " + dat.responses);
    }
    dat.responses.push(res);
    STORAGE.setItem(savedName, JSON.stringify(dat));
    return res;
}
