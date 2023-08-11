import {
	ENTITY_TYPE,
	PRIMARY_KEY,
	factory,
	oneOf,
	primaryKey,
} from "@mswjs/data";
import { nanoid } from "@reduxjs/toolkit";

export const db = factory({
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

export type DB = typeof db;

export type Entity<Key extends keyof DB> = Omit<
	ReturnType<DB[Key]["create"]>,
	typeof ENTITY_TYPE | typeof PRIMARY_KEY
>;
