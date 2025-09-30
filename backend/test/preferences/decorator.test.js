const sinon = require("sinon");
const { expect } = require("chai");
const mongoose = require("mongoose");

const NotificationPreference = require("../../models/notificationPreference");
const PreferenceFilterDecorator = require("../../services/preferences/PreferenceFilterDecorator");

describe("PreferenceFilterDecorator", () => {
	let sandbox;
	let innerNotifier;
	let decorator;
	const u1 = new mongoose.Types.ObjectId();
	const u2 = new mongoose.Types.ObjectId();
	
	function stubFindReturning(docsArray) {
		return sandbox.stub(NotificationPreference, "find").callsFake(() => ({
			select: () => ({
				lean: () => Promise.resolve(docsArray),
			}),
		}));
	}

	beforeEach(() => {
		sandbox = sinon.createSandbox();
		innerNotifier = { notify: sandbox.stub().resolves() };
		decorator = new PreferenceFilterDecorator(innerNotifier);
	});

	afterEach(() => {
		sandbox.restore();
	});

	it("should notify users who have enabled notifications (no record defaults to enabled)", async () => {
		stubFindReturning([{ userId: u1, enabled: true }]);

		await decorator.notify([u1, u2], "TEST", {});

		expect(innerNotifier.notify.calledOnce).to.be.true;
		const [allowed] = innerNotifier.notify.firstCall.args;
		expect(allowed).to.include.members([u1, u2]); 
	});

	it("should skip users with enabled=false", async () => {
		stubFindReturning([{ userId: u1, enabled: false }]);

		await decorator.notify([u1, u2], "TEST", {});

		expect(innerNotifier.notify.calledOnce).to.be.true;
		const [allowed] = innerNotifier.notify.firstCall.args;
		expect(allowed).to.include(u2);
		expect(allowed).to.not.include(u1);
	});

	it("should not call inner notify if all disabled", async () => {
		// Both users have docs with enabled=false
		stubFindReturning([
			{ userId: u1, enabled: false },
			{ userId: u2, enabled: false },
		]);

		await decorator.notify([u1, u2], "TEST", {});
		expect(innerNotifier.notify.notCalled).to.be.true;
	});
});
