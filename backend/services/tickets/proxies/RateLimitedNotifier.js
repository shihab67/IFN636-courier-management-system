const bucket = new Map(); // userId -> last timestamp
class RateLimitedNotifier {
	constructor(inner, minMs = 500) {
		this.inner = inner;
		this.minMs = minMs;
	}
	sendBulk(userIds, type, payload) {
		const now = Date.now();
		const allowed = userIds.filter(
			(id) => now - (bucket.get(id) || 0) >= this.minMs
		);
		allowed.forEach((id) => bucket.set(id, now));
		if (allowed.length) this.inner?.sendBulk(allowed, type, payload);
	}
}
module.exports = RateLimitedNotifier;
