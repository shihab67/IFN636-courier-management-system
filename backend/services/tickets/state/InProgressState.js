const TicketState = require("./TicketState");
class InProgressState extends TicketState {
	requestInfo() {
		this.ticket.status = "REQUEST_INFO";
	}
	resolve() {
		this.ticket.status = "RESOLVED";
	}
}
module.exports = InProgressState;
