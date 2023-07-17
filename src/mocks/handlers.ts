import { faker } from "@faker-js/faker";
import {
	ENTITY_TYPE,
	PRIMARY_KEY,
	factory,
	oneOf,
	primaryKey,
} from "@mswjs/data";
import { nanoid } from "@reduxjs/toolkit";
import { rest } from "msw";

const USERS = 3;
const POSTS_PER_USERS = 3;
const DELAY_MS = 1000;

const db = factory({
	user: {
		id: primaryKey(nanoid),
		name: String,
	},
	post: {
		id: primaryKey(nanoid),
		title: String,
		content: String,
		user: oneOf("user"),
		reactionCounts: oneOf("reactionCounts"),
		createdAt: String,
	},
	reactionCounts: {
		id: primaryKey(nanoid),
		thumbsUp: Number,
		hooray: Number,
		heart: Number,
		rocket: Number,
		eyes: Number,
	},
});

type DB = typeof db;

type Entity<Key extends keyof DB> = Omit<
	ReturnType<DB[Key]["create"]>,
	typeof ENTITY_TYPE | typeof PRIMARY_KEY
>;

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
		const json = await req.json();
		const user = db.user.findFirst({ where: { id: { equals: json.userId } } });
		if (user == null) return res(ctx.status(400));
		const post = db.post.create({
			title: json.title,
			content: json.content,
			user,
			reactionCounts: db.reactionCounts.create(),
			createdAt: new Date().toISOString(),
		});
		return res(ctx.delay(DELAY_MS), ctx.json(serializePost(post)));
	}),
];
