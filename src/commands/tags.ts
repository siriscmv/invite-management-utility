import { Message, TextChannel } from 'discord.js';
import { staffRoles } from 'src/config';
import prisma from 'src/utils/prisma';
import tags from 'src/utils/tags';
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
	(msg.channel as TextChannel).send(Array.from(tags.keys()).map((t) => `\`${t}\``).join(', '));
};

const addTag = async (msg: Message) => {
	const args = msg.content.split(' ');
	args.shift(); // Remove command name
	args.shift(); // Remove subcommand name
	const trigger = args.shift()?.trim(); 
	const response = args.join(' ').trim();

	if (!trigger || response.length === 0) return msg.reply('Invalid syntax. Use `tags add <trigger> <response>`');
	if (tags.has(trigger)) return msg.reply('Tag already exists.');

	await prisma.tags.create({
		data: {
			trigger,
			response
		}});

	tags.set(trigger, response);

	return msg.reply('Tag added.');
};

const deleteTag = async (msg: Message) => {
	const args = msg.content.split(' ');
	args.shift(); // Remove command name
	args.shift(); // Remove subcommand name
	const trigger = args.shift()?.trim();

	if (!trigger) return msg.reply('Invalid syntax. Use `tags delete <trigger>`');
	if (!tags.has(trigger)) return msg.reply('Tag does not exist.');

	await prisma.tags.delete({
		where: {
			trigger
		}
	});

	tags.delete(trigger);
	return msg.reply('Tag deleted.');
};
