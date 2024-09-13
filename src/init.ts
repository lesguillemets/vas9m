function init(){
	prepareStartPage();
	document.getElementById('next').onclick = () => theQuestions[0].render({'isLastQ': false});
}


window.addEventListener('load', init);
