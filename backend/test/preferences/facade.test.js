const sinon = require("sinon");
const { expect } = require("chai");
const mongoose = require("mongoose");

const NotificationPreference = require("../../models/notificationPreference");
const PreferencesFacade = require("../../services/preferences/PreferencesFacade");

describe("PreferencesFacade", () => {
	let sandbox;
	let facade;
	const fakeUserId = new mongoose.Types.ObjectId();

	beforeEach(() => {
		sandbox = sinon.createSandbox();
		facade = new PreferencesFacade({ NotificationPreference });
	});

	afterEach(() => {
		sandbox.restore();
	});

	it("should create prefs if none exist", async () => {
		sandbox
			.stub(NotificationPreference, "findOne")
			.returns({ lean: () => Promise.resolve(null) });
		sandbox.stub(NotificationPreference, "create").resolves({
			toObject: () => ({ enabled: true }),
		});

		const prefs = await facade.getOrCreateForUser(fakeUserId);
		expect(prefs).to.deep.equal({ enabled: true });
	});

	it("should return existing prefs", async () => {
		sandbox.stub(NotificationPreference, "findOne").returns({
			lean: () => Promise.resolve({ enabled: false }),
		});

		const prefs = await facade.getOrCreateForUser(fakeUserId);
		expect(prefs).to.deep.equal({ enabled: false });
	});

	it("should update prefs with boolean true", async () => {
		sandbox.stub(NotificationPreference, "findOneAndUpdate").returns({
			lean: () => Promise.resolve({ enabled: true }),
		});

		const prefs = await facade.updateForUser(fakeUserId, { enabled: true });
		expect(prefs.enabled).to.equal(true);
	});

	it('should update prefs with string "false"', async () => {
		sandbox.stub(NotificationPreference, "findOneAndUpdate").returns({
			lean: () => Promise.resolve({ enabled: false }),
		});

		const prefs = await facade.updateForUser(fakeUserId, {
			enabled: "false",
		});
		expect(prefs.enabled).to.equal(false);
	});

	it("should ignore bad strings (leave as default true)", async () => {
		sandbox.stub(NotificationPreference, "findOneAndUpdate").returns({
			lean: () => Promise.resolve({ enabled: true }),
		});

		const prefs = await facade.updateForUser(fakeUserId, {
			enabled: "banana",
		});
		expect(prefs.enabled).to.equal(true);
	});
});
