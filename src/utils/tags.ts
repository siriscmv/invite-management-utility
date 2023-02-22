import { Collection } from 'discord.js';

const tags = new Collection<string, string>();

export const loadTags = async () => {
	//TODO: Fetch tags from database
};

export default tags;
