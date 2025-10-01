const Ticket = require("../models/Ticket");
const response = require("../utils/response");

module.exports = async (req, res, next) => {
	if (req.user.role.name === "Admin") return next();
	const t = await Ticket.findById(req.params.id).lean();
	if (!t) return response.error(res, "Ticket not found", 404);
	const mine = String(t.createdBy) === String(req.user.id);
	const assigned =
		t.assignedTo && String(t.assignedTo) === String(req.user.id);
	return mine || assigned ? next() : response.error(res, "Forbidden", 403);
};
