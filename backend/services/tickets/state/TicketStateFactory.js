const OpenState = require("./OpenState");
const AssignedState = require("./AssignedState");
const InProgressState = require("./InProgressState");
const RequestInfoState = require("./RequestInfoState");
const ResolvedState = require("./ResolvedState");
const ClosedState = require("./ClosedState");

exports.from = (ticket, ctx = {}) => {
	switch (ticket.status) {
		case "OPEN":
			return new OpenState(ticket, ctx);
		case "ASSIGNED":
			return new AssignedState(ticket, ctx);
		case "IN_PROGRESS":
			return new InProgressState(ticket, ctx);
		case "REQUEST_INFO":
			return new RequestInfoState(ticket, ctx);
		case "RESOLVED":
			return new ResolvedState(ticket, ctx);
		case "CLOSED":
			return new ClosedState(ticket, ctx);
		default:
			return new OpenState(ticket, ctx);
	}
};
