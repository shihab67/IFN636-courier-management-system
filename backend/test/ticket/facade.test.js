const { expect } = require("chai");
const sinon = require("sinon");
const TicketFacade = require("../../services/tickets/TicketFacade");

describe("TicketFacade", () => {
	let Ticket, TicketComment, notifier, facade;

	beforeEach(() => {
		// fake Mongoose models with sinon
		Ticket = {
			create: sinon.stub(),
			findById: sinon.stub(),
		};
		TicketComment = { create: sinon.stub() };

		notifier = { notify: sinon.stub().resolves() };

		facade = new TicketFacade({ Ticket, TicketComment }, notifier);
	});

	afterEach(() => sinon.restore());

	it("should create a ticket and send notification", async () => {
		const fakeTicket = { _id: "123", title: "Test", status: "OPEN" };
		Ticket.create.resolves(fakeTicket);

		const result = await facade.create({
			userId: "u1",
			title: "Test",
			description: "...",
		});
		expect(result).to.equal(fakeTicket);
		expect(Ticket.create.calledOnce).to.be.true;
		expect(notifier.notify.calledOnce).to.be.true;
	});

	it("should transition ASSIGNED -> IN_PROGRESS", async () => {
		const fakeTicket = {
			_id: "123",
			status: "ASSIGNED",
			assignedTo: "u1",
			save: sinon.stub().resolves(),
		};
		Ticket.findById.resolves(fakeTicket);

		const result = await facade.transition({
			ticketId: "123",
			actorId: "u1",
			action: "start_progress",
		});

		expect(result.status).to.equal("IN_PROGRESS");
		expect(fakeTicket.save.calledOnce).to.be.true;
	});

	it("should add a comment and notify", async () => {
		TicketComment.create.resolves({ _id: "c1", message: "hello" });
		Ticket.findById.returns({
			lean: sinon
				.stub()
				.resolves({ _id: "123", createdBy: "u1", assignedTo: "u2" }),
		});

		const result = await facade.comment({
			ticketId: "123",
			authorId: "u1",
			message: "hello",
		});
		expect(result.message).to.equal("hello");
		expect(notifier.notify.calledOnce).to.be.true;
	});
});
