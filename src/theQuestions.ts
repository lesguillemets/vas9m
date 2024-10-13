/// This is where you'll edit to create actual questions.
/// For the definition of Question class, see question.ts

function genQuestions(): VasQuestion[] {
	const head: string = "当てはまるところを選んでください";
	const qs: VasQuestion[] = [];
	qs.push(new VasQuestion(head, "目が覚めている", "眠気がある"));
	qs.push(new VasQuestion(head, "安心している", "不安感がある"));
	qs.push(new VasQuestion(head, "元気", "疲れている"));
	qs.push(new VasQuestion(head, "リラックスしている", "緊張している"));
	qs.push(new VasQuestion(head, "楽しい", "楽しくない"));
	qs.push(new VasQuestion(head, "心地よい", "不快"));
	// qs.push(tryImageQuestion());
	return qs;
}

// demo for including pictures
// function tryImageQuestion(): Question {
// 	const imageCont: HTMLElement = document.createElement('div');
// 	imageCont.classList.add("center-image");
// 	const preImg = document.createElement('img');
// 	preImg.src = "https://live.staticflickr.com/3852/14566879637_13d5d2a0b1_n.jpg";
// 	const pre: HTMLElement = imageCont.cloneNode() as HTMLElement;
// 	pre.appendChild(preImg);
// 	const postImg = document.createElement('img');
// 	postImg.src = "https://live.staticflickr.com/3835/14752671885_b9f0b22a82_n.jpg";
// 	const post: HTMLElement = imageCont.cloneNode() as HTMLElement;
// 	post.appendChild(postImg);
// 	const q = new Question (
// 		"どちらかというと",
// 		pre,
// 		post,
// 	);
// 	return q;
// }

const theQuestions = genQuestions();
