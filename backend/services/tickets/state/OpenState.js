const TicketState = require("./TicketState");
class OpenState extends TicketState {
	assign(assigneeId) {
		this.ticket.status = "ASSIGNED";
		this.ticket.assignedTo = assigneeId;
	}
	close() {
		this.ticket.status = "CLOSED";
	}
}
module.exports = OpenState;
