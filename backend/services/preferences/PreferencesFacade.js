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
		const $set = {};
		if (patch.hasOwnProperty("enabled")) {
			if (typeof patch.enabled === "boolean") {
				$set.enabled = patch.enabled;
			} else if (typeof patch.enabled === "string") {
				if (patch.enabled.toLowerCase() === "true") $set.enabled = true;
				else if (patch.enabled.toLowerCase() === "false")
					$set.enabled = false;
			}
		}
		return this.NotificationPreference.findOneAndUpdate(
			{ userId },
			{ $set },
			{ new: true, upsert: true }
		).lean();
	}
}
module.exports = PreferencesFacade;
