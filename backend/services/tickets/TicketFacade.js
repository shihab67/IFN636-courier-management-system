const StateFactory = require("./state/TicketStateFactory");

class TicketFacade {
	constructor(models, notifier) {
		this.Ticket = models.Ticket;
		this.TicketComment = models.TicketComment;
		this.notifier = notifier; // NotificationCenter.instance()
	}

	async create({ userId, title, description, category, priority }) {
		const t = await this.Ticket.create({
			title,
			description,
			category,
			priority,
			createdBy: userId,
		});
		await this.notifier.notify(
			[userId],
			"TICKET_CREATED",
			{ title },
			t._id
		);
		return t;
	}

	async transition({ ticketId, actorId, action, assigneeId }) {
		const t = await this.Ticket.findById(ticketId);
		if (!t) throw new Error("Ticket not found");

		const state = StateFactory.from(t, { actorId });
		switch (action) {
			case "assign":
				state.assign(assigneeId);
				break;
			case "start_progress":
				state.startProgress();
				break;
			case "request_info":
				state.requestInfo();
				break;
			case "resolve":
				state.resolve();
				break;
			case "close":
				state.close();
				break;
			case "reopen":
				state.reopen();
				break;
			default:
				throw new Error("Unknown action");
		}
		await t.save();

		// notify creator + assignee if present
		const targets = [String(t.createdBy)];
		if (t.assignedTo) targets.push(String(t.assignedTo));
		await this.notifier.notify(
			targets,
			"TICKET_STATUS_CHANGED",
			{ status: t.status },
			t._id
		);
		return t;
	}

	async comment({ ticketId, authorId, message }) {
		const c = await this.TicketComment.create({
			ticketId,
			authorId,
			message,
		});
		const t = await this.Ticket.findById(ticketId).lean();
		const targets = [String(t.createdBy)];
		if (t.assignedTo) targets.push(String(t.assignedTo));
		await this.notifier.notify(
			targets,
			"TICKET_COMMENT",
			{ ticketId, message },
			ticketId
		);
		return c;
	}
}
module.exports = TicketFacade;
