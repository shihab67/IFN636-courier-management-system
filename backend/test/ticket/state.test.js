const { expect } = require("chai");
const OpenState = require("../../services/tickets/state/OpenState");
const AssignedState = require("../../services/tickets/state/AssignedState");
const InProgressState = require("../../services/tickets/state/InProgressState");
const ResolvedState = require("../../services/tickets/state/ResolvedState");

describe("Ticket State Pattern", () => {
	let ticket;

	beforeEach(() => {
		ticket = { status: "OPEN", assignedTo: null }; // fake mongoose doc
	});

	it("should allow assigning from OPEN", () => {
		const state = new OpenState(ticket);
		state.assign("user123");
		expect(ticket.status).to.equal("ASSIGNED");
		expect(ticket.assignedTo).to.equal("user123");
	});

	it("should NOT allow startProgress from OPEN", () => {
		const state = new OpenState(ticket);
		expect(() => state.startProgress()).to.throw(
			"Illegal 'start_progress'"
		);
	});

	it("should allow startProgress from ASSIGNED", () => {
		ticket.status = "ASSIGNED";
		ticket.assignedTo = "user123";
		const state = new AssignedState(ticket);
		state.startProgress();
		expect(ticket.status).to.equal("IN_PROGRESS");
	});

	it("should not allow startProgress from ASSIGNED if no assignee", () => {
		ticket.status = "ASSIGNED";
		const state = new AssignedState(ticket);
		expect(() => state.startProgress()).to.throw(
			"Cannot start progress without an assignee"
		);
	});

	it("should allow resolve from IN_PROGRESS", () => {
		ticket.status = "IN_PROGRESS";
		const state = new InProgressState(ticket);
		state.resolve();
		expect(ticket.status).to.equal("RESOLVED");
	});

	it("should allow reopen from RESOLVED", () => {
		ticket.status = "RESOLVED";
		const state = new ResolvedState(ticket);
		state.reopen();
		expect(ticket.status).to.equal("ASSIGNED");
	});
});
