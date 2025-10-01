const TicketState = require("./TicketState");
class RequestInfoState extends TicketState {
	startProgress() {
		this.ticket.status = "IN_PROGRESS";
	}
}
module.exports = RequestInfoState;
