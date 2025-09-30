class PreferencesFacade {
	constructor({ NotificationPreference }) {
		this.NotificationPreference = NotificationPreference;
	}

	async getOrCreateForUser(userId) {
		let doc = await this.NotificationPreference.findOne({ userId }).lean();
		if (!doc) {
			doc = await this.NotificationPreference.create({
				userId,
				enabled: true,
			});
			doc = doc.toObject();
		}
		return { enabled: !!doc.enabled };
	}

	async updateForUser(userId, patch) {
		let newValue;

		if (typeof patch?.enabled === "boolean") {
			newValue = patch.enabled;
		} else if (typeof patch?.enabled === "string") {
			const v = patch.enabled.trim().toLowerCase();
			newValue = v === "true" || v === "1" || v === "yes" || v === "on";
		}

		const $set = {};
		if (typeof newValue === "boolean") {
			$set.enabled = newValue;
		}

		const doc = await this.NotificationPreference.findOneAndUpdate(
			{ userId },
			Object.keys($set).length ? { $set } : {},
			{ new: true, upsert: true, setDefaultsOnInsert: true }
		).lean();

		return { enabled: !!doc.enabled };
	}
}
module.exports = PreferencesFacade;
