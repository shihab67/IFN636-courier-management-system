const NotificationPreference = require("../models/notificationPreference");
const PreferencesFacade = require("../services/preferences/PreferencesFacade");
const response = require("../utils/response");

const facade = new PreferencesFacade({ NotificationPreference });

exports.getMine = async (req, res) => {
	try {
		const prefs = await facade.getOrCreateForUser(req.user.id);
		return response.success(res, "Preferences fetched", prefs);
	} catch (e) {
		return response.error(res, e.message);
	}
};

exports.updateMine = async (req, res) => {
	try {
		// expects { enabled: true/false }
		const prefs = await facade.updateForUser(req.user.id, req.body);
		return response.success(res, "Preferences updated", prefs);
	} catch (e) {
		return response.error(res, e.message);
	}
};
