const startPage = new Flip("よろしくおねがいします", "", "");
function prepareStartPage() {
    startPage.basicRender("回答を始める");
    // FIXME I know, I don't want it
    document.getElementById('centre').innerHTML = `
	<label class="weaktext" for="participantID">参加者ID</label>
		<input type="text" size="7" placeholder="IDを入力" spellcheck="false" autocorrect="off" id="participantID">
	`;
}
