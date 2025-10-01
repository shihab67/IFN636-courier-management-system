const NotificationPreference = require("../../models/notificationPreference");

class PreferenceFilterDecorator {
	constructor(innerNotifier) {
		this.inner = innerNotifier;
	}

	async notify(userIds, type, payload, dedupeKey) {
		if (!Array.isArray(userIds) || userIds.length === 0) return;

		const docs = await NotificationPreference.find({
			userId: { $in: userIds },
		})
			.select("userId enabled")
			.lean();

		const disabled = new Set(
			docs.filter((d) => d.enabled === false).map((d) => String(d.userId))
		);
		
		const allowed = userIds.filter((id) => !disabled.has(String(id)));

		if (allowed.length === 0) return;
		return this.inner.notify(allowed, type, payload, dedupeKey);
	}
}
module.exports = PreferenceFilterDecorator;
