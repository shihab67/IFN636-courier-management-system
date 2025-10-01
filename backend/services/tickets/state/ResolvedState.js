const TicketState = require("./TicketState");
class ResolvedState extends TicketState {
	close() {
		this.ticket.status = "CLOSED";
	}
	reopen() {
		this.ticket.status = "ASSIGNED";
	}
}
module.exports = ResolvedState;
