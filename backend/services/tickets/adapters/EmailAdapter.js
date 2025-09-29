class EmailAdapter {
	sendBulk(userIds, type, payload) {
		// swap with real email later; adapter keeps interface stable
		console.log("[EmailAdapter]", { to: userIds, type, payload });
	}
}
module.exports = EmailAdapter;
