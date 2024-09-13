/// This is where you'll edit to create actual questions.
/// For the definition of Question class, see question.ts
function genQuestions() {
    const head = "当てはまるところを選んでください";
    let qs = [];
    qs.push(new Question(head, "リラックスしている", "緊張している"));
    // too many makes it harder to check
    // qs.push(new Question(head, "安心している", "不安感がある"));
    // qs.push(new Question(head, "眠気がある", "目が覚めている"));
    qs.push(tryImageQuestion());
    qs.push(new Question(head, "元気", "疲れている"));
    // qs.push(new Question(head, "心地よい気分", "不快な気分"));
    return qs;
}
function tryImageQuestion() {
    const imageCont = document.createElement('div');
    imageCont.classList.add("center-image");
    let preImg = document.createElement('img');
    preImg.src = "https://live.staticflickr.com/3852/14566879637_13d5d2a0b1_n.jpg";
    let pre = imageCont.cloneNode();
    pre.appendChild(preImg);
    let postImg = document.createElement('img');
    postImg.src = "https://live.staticflickr.com/3835/14752671885_b9f0b22a82_n.jpg";
    let post = imageCont.cloneNode();
    post.appendChild(postImg);
    const q = new Question("どちらかというと", pre, post);
    return q;
}
const theQuestions = genQuestions();
