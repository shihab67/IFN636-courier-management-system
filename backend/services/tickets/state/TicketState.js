class TicketState {
	constructor(ticket, ctx) {
		this.ticket = ticket;
		this.ctx = ctx;
	}
	assign() {
		this._illegal("assign");
	}
	startProgress() {
		this._illegal("start_progress");
	}
	requestInfo() {
		this._illegal("request_info");
	}
	resolve() {
		this._illegal("resolve");
	}
	close() {
		this._illegal("close");
	}
	reopen() {
		this._illegal("reopen");
	}
	_illegal(action) {
		throw new Error(`Illegal '${action}' from ${this.ticket.status}`);
	}
}

module.exports = TicketState;
