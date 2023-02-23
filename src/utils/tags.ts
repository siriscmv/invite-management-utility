import { Collection } from 'discord.js';
import prisma from './prisma.js';

const tags = new Collection<string, string>();

export const loadTags = async () => {
	const dbTags = await prisma.tags.findMany();
	for (const tag of dbTags) {
		tags.set(tag.trigger, tag.response);
	}
};

export default tags;
