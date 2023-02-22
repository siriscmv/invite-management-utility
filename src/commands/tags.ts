import { Message } from 'discord.js';
import { staffRoles } from 'src/config';
import { Command } from '../utils/commands';

const command: Command = {
	name: 'tags',
	aliases: ['tag'],
	shouldRun: (msg: Message) => {
		if (msg.member!.roles.cache.some((r) => staffRoles.includes(r.id))) return true;
		if (msg.content.split(' ')[1]) return 'Use the `tags` command to view all tags';
		return false;
	},
	run: (msg: Message) => {
		const subCommand = msg.content.split(' ')[1] ?? 'list';
		switch (subCommand) {
			case 'list':
				return listTags(msg);
			case 'add':
				return addTag(msg);
			case 'delete':
				return deleteTag(msg);
			default:
				return msg.reply('Invalid subcommand');
		}
	}
};

export default command;

const listTags = async (msg: Message) => {
	const tags = await (msg.client as SapphireClient).tags.raw.findAll();
	const tagList = tags.map(
		(tag: { trigger: any; createdAt: string | number | Date }) =>
			`**${tag.trigger}** <t:${Math.round(new Date(tag.createdAt).getTime() / 1000)}:R>`
	);
	msg.channel.send(tagList.join('\n'));
};

const addTag = async (msg: Message) => {
	const trigger = await args.pick('string');
	const response = await args.rest('message').catch(() => args.rest('string'));
	const data =
		response instanceof Message
			? JSON.stringify({ content: response.content, embeds: response.embeds, components: response.components })
			: JSON.stringify(response);

	await msg.client.tags.set(trigger, data);
	return msg.reply(`Tag added with name \`${trigger}\``);
};

const deleteTag = async (msg: Message) => {
	const name = await args.rest('string');
	const tag = msg.client.tags.get(name);
	if (!tag) return msg.reply('Tag not found.');
	await msg.client.tags.delete(name);
	return msg.reply('Tag deleted.');
};
