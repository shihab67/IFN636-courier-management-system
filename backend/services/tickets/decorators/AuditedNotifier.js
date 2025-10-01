class AuditedNotifier {
	constructor(inner) {
		this.inner = inner;
	}
	sendBulk(userIds, type, payload) {
		console.log("[Audit] notify", { userIds, type });
		this.inner?.sendBulk(userIds, type, payload);
	}
}
module.exports = AuditedNotifier;
