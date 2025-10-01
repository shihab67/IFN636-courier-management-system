const Ticket = require("../models/Ticket");
const TicketComment = require("../models/TicketComment");
const Notification = require("../models/Notification");

const TicketFacade = require("../services/tickets/TicketFacade");
const NotificationCenter = require("../services/tickets/NotificationCenter");
const EmailAdapter = require("../services/tickets/adapters/EmailAdapter");
const AuditedNotifier = require("../services/tickets/decorators/AuditedNotifier");
const RateLimitedNotifier = require("../services/tickets/proxies/RateLimitedNotifier");

const PreferenceFilterDecorator = require("../services/preferences/PreferenceFilterDecorator");

const response = require("../utils/response");

// Build notifier chain: EmailAdapter -> AuditedDecorator -> RateLimitedProxy
const baseAdapter = new EmailAdapter();
const audited = new AuditedNotifier(baseAdapter);
const rateLimited = new RateLimitedNotifier(audited, 250);
const prefFiltered = new PreferenceFilterDecorator(rateLimited);

const notifier = NotificationCenter.init({ Notification }, prefFiltered);
const facade = new TicketFacade({ Ticket, TicketComment }, notifier);

exports.create = async (req, res, next) => {
	try {
		const ticket = await facade.create({
			userId: req.user.id,
			...req.body,
		});
		return response.success(
			res,
			"Ticket created successfully",
			ticket,
			201
		);
	} catch (e) {
		return response.error(res, e.message, 500);
	}
};

exports.list = async (req, res, next) => {
	try {
		const filter =
			req.user.role.name === "Admin"
				? {}
				: {
						$or: [
							{ createdBy: req.user.id },
							{ assignedTo: req.user.id },
						],
				  };
		const data = await Ticket.find(filter)
			.populate("assignedTo", "name email")
			.populate("createdBy", "name email")
			.sort({ createdAt: -1 });
		return response.success(res, "Tickets fetched successfully", data);
	} catch (e) {
		return response.error(res, e.message, 500);
	}
};

exports.get = async (req, res, next) => {
	try {
		const t = await Ticket.findById(req.params.id)
			.populate("assignedTo", "name email")
			.populate("createdBy", "name email");
		if (!t) return response.error(res, "Ticket not found", 404);
		return response.success(res, "Ticket fetched successfully", t);
	} catch (e) {
		return response.error(res, e.message, 500);
	}
};

exports.update = async (req, res, next) => {
	try {
		const t = await Ticket.findById(req.params.id);
		if (!t) return response.error(res, "Ticket not found", 404);
		if (t.status === "CLOSED")
			return response.error(res, "Ticket already closed", 400);

		Object.assign(t, {
			title: req.body.title,
			description: req.body.description,
			category: req.body.category,
			priority: req.body.priority,
		});
		await t.save();
		return response.success(res, "Ticket updated successfully", t);
	} catch (e) {
		return response.error(res, e.message, 500);
	}
};

exports.transition = async (req, res, next) => {
	try {
		const updated = await facade.transition({
			ticketId: req.params.id,
			actorId: req.user.id,
			action: req.body.action,
			assigneeId: req.body.assigneeId,
		});
		return response.success(
			res,
			"Ticket status updated successfully",
			updated
		);
	} catch (e) {
		return response.error(res, e.message, 500);
	}
};

exports.comment = async (req, res, next) => {
	try {
		const c = await facade.comment({
			ticketId: req.params.id,
			authorId: req.user.id,
			message: req.body.message,
		});
		return response.success(res, "Comment added successfully", c);
	} catch (e) {
		return response.error(res, e.message, 500);
	}
};

exports.getComments = async (req, res, next) => {
	try {
		const list = await TicketComment.find({ ticketId: req.params.id }).sort({
			createdAt: -1,
		}).populate("authorId", "name email");
		return response.success(res, "Comments fetched successfully", list);
	} catch (e) {
		return response.error(res, e.message, 500);
	}
};

exports.notifications = async (req, res, next) => {
	try {
		const list = await Notification.find({ userId: req.user.id }).sort({
			createdAt: -1,
		});
		return response.success(
			res,
			"Notifications fetched successfully",
			list
		);
	} catch (e) {
		return response.error(res, e.message, 500);
	}
};
