const TicketState = require("./TicketState");
class AssignedState extends TicketState {
	startProgress() {
		if (!this.ticket.assignedTo) {
			throw new Error("Cannot start progress without an assignee");
		}
		this.ticket.status = "IN_PROGRESS";
	}
	requestInfo() {
		this.ticket.status = "REQUEST_INFO";
	}
	resolve() {
		this.ticket.status = "RESOLVED";
	}
}
module.exports = AssignedState;
