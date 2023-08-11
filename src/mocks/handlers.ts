import { faker } from "@faker-js/faker";
import { nanoid } from "@reduxjs/toolkit";
import { subMinutes } from "date-fns";
import { rest } from "msw";
import { getRandomInt, randomFromArray } from "../common/random";
import { Entity, db } from "./db";

const USERS = 3;
const POSTS_PER_USERS = 3;
const DELAY_MS = 1000;

for (let i = 0; i < USERS; i++) {
	const user = db.user.create({
		name: faker.person.fullName(),
	});
	for (let j = 0; j < POSTS_PER_USERS; j++) {
		db.post.create({
			title: faker.lorem.words(),
			content: faker.lorem.paragraphs(),
			user,
			reactionCounts: db.reactionCounts.create(),
			createdAt: faker.date.recent({ days: 7 }).toISOString(),
		});
	}
}

const serializePost = (post: Entity<"post">) => {
	const { user, ...rest } = post;
	return { ...rest, userId: user?.id ?? "" };
};

export const handlers = [
	rest.get("/fakeApi/users", (_, res, ctx) => {
		return res(ctx.delay(DELAY_MS), ctx.json(db.user.getAll()));
	}),
	rest.get("/fakeApi/posts", (_, res, ctx) => {
		return res(
			ctx.delay(DELAY_MS),
			ctx.json(db.post.getAll().map(serializePost)),
		);
	}),
	rest.post("/fakeApi/posts", async (req, res, ctx) => {
		const json = await req.json<{
			title: string;
			content: string;
			userId: string;
		}>();
		const user = db.user.findFirst({ where: { id: { equals: json.userId } } });
		if (user == null) return res(ctx.delay(DELAY_MS), ctx.status(400));
		const post = db.post.create({
			title: json.title,
			content: json.content,
			user,
			reactionCounts: db.reactionCounts.create(),
			createdAt: new Date().toISOString(),
		});
		return res(ctx.delay(DELAY_MS), ctx.json(serializePost(post)));
	}),
	rest.get<never, { postId: string }>(
		"/fakeApi/posts/:postId",
		(req, res, ctx) => {
			const { postId } = req.params;
			const post = db.post.findFirst({ where: { id: { equals: postId } } });
			if (post == null) return res(ctx.delay(DELAY_MS), ctx.status(400));
			return res(ctx.delay(DELAY_MS), ctx.json(serializePost(post)));
		},
	),
	rest.patch<never, { postId: string }>(
		"/fakeApi/posts/:postId",
		async (req, res, ctx) => {
			const { postId } = req.params;
			const json = await req.json<{ title: string; content: string }>();
			const updatedPost = db.post.update({
				where: { id: { equals: postId } },
				data: { title: json.title, content: json.content },
			});
			if (updatedPost == null) return res(ctx.delay(DELAY_MS), ctx.status(400));
			return res(ctx.delay(DELAY_MS), ctx.json(serializePost(updatedPost)));
		},
	),
	rest.post<never, { postId: string }>(
		"/fakeApi/posts/:postId/reactions",
		async (req, res, ctx) => {
			const { postId } = req.params;
			const json = await req.json<{
				reactionKey: "thumbsUp" | "hooray" | "heart" | "rocket" | "eyes";
			}>();
			const updatedPost = db.post.update({
				where: { id: { equals: postId } },
				data: {
					reactionCounts: (prevValue) => {
						return (
							db.reactionCounts.update({
								where: { id: { equals: prevValue.id } },
								data: { [json.reactionKey]: prevValue[json.reactionKey] + 1 },
							}) ?? prevValue
						);
					},
				},
			});
			if (updatedPost == null) return res(ctx.delay(DELAY_MS), ctx.status(400));
			return res(ctx.delay(DELAY_MS), ctx.json(serializePost(updatedPost)));
		},
	),
	rest.get("/fakeApi/notifications", (_, res, ctx) => {
		const notificationTemplates = [
			"poked you",
			"says hi!",
			"is glad we're friends",
			"sent you a gift",
		];
		const now = new Date();
		const past = subMinutes(now, 15);
		const users = db.user.getAll();
		const notifcations = [...Array(getRandomInt(1, 5))].map(() => ({
			id: nanoid(),
			message: randomFromArray(notificationTemplates),
			userId: randomFromArray(users).id,
			createdAt: faker.date.between({ from: past, to: now }),
		}));
		return res(ctx.delay(DELAY_MS), ctx.json(notifcations));
	}),
];
