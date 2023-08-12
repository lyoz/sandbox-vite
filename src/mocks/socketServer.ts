import { faker } from "@faker-js/faker";
import { nanoid } from "@reduxjs/toolkit";
import { parseISO } from "date-fns";
import { Client, Server } from "mock-socket";
import { getRandomInt, randomFromArray } from "../common/random";
import { db } from "./db";

const socketServer = new Server("ws://localhost");

let currentSocket: Client;

const sendRandomNotifications = (socket: Client, since: string) => {
	const notificationTemplates = [
		"poked you",
		"says hi!",
		`is glad we're friends`,
		"sent you a gift",
	];
	const now = new Date();
	const past = parseISO(since);
	const users = db.user.getAll();
	const notifications = [...Array(getRandomInt(1, 5))].map(() => {
		return {
			id: nanoid(),
			message: randomFromArray(notificationTemplates),
			userId: randomFromArray(users).id,
			createdAt: faker.date.between({ from: past, to: now }),
		};
	});

	socket.send(
		JSON.stringify({ type: "notifications", payload: notifications }),
	);
};

export const forceGenerateNotifications = (since: string) => {
	sendRandomNotifications(currentSocket, since);
};

socketServer.on("connection", (socket) => {
	currentSocket = socket;

	socket.on("message", (data) => {
		if (typeof data !== "string") return;
		const message: unknown = JSON.parse(data);
		if (
			message != null &&
			typeof message === "object" &&
			"type" in message &&
			message.type === "notifications" &&
			"payload" in message &&
			typeof message.payload === "string"
		) {
			const since = message.payload;
			sendRandomNotifications(socket, since);
		}
	});
});
