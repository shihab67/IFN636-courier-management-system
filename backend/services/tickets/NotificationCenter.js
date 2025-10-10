let _instance;

class NotificationCenter {
	constructor({ Notification }, notifier) {
		this.Notification = Notification;
		this.notifier = notifier; // any object with sendBulk(userIds, type, payload)
	}
	static init(models, notifier) {
		_instance = new NotificationCenter(models, notifier);
		return _instance;
	}
	static instance() {
		return _instance;
	}

	async notify(userIds, type, payload, ticketId = null) {
		await Promise.all(
			userIds.map((uid) =>
				this.Notification.create({
					userId: uid,
					ticketId,
					type,
					payload,
				})
			)
		);
		// if (this.notifier) this.notifier.sendBulk(userIds, type, payload);
	}
}
module.exports = NotificationCenter;
