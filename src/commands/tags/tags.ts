import { Args, Command, SapphireClient } from '@sapphire/framework';
import { Message } from 'discord.js';

export class TagsCommand extends Command {
	public constructor(context: Command.Context, options: Command.Options) {
		super(context, {
			...options,
			name: 'tags',
			aliases: ['tag'],
			description: 'Add/View/Delete/List a tag(s)',
			quotes: [['"', '"']],
			preconditions: ['StaffOnly'],
			options: ['response', 'trigger']
		});
	}

	public async messageRun(message: Message, args: Args) {
		const subCommand = await args.rest('string');
		if (subCommand === 'list') return this.list(message);
		if (subCommand === 'view') return this.view(message, args);
		if (subCommand === 'add') return this.add(message, args);
		if (subCommand === 'delete') return this.delete(message, args);
		return message.reply('Invalid subcommand.\nUse `list`, `view`, `add`, or `delete`.');
	}

	private async list(msg: Message) {
		const tags = await (msg.client as SapphireClient).tags.findAll();
		const tagList = tags.map(
			(tag: { trigger: any; createdAt: string | number | Date }) =>
				`**${tag.trigger}** <t:${Math.round(new Date(tag.createdAt).getTime() / 1000)}:R>`
		);
		msg.channel.send(tagList.join('\n'));
	}

	private async view(msg: Message, args: Args) {
		const name = await args.rest('string');
		const tag = msg.client.tags.get(name);
		return msg.channel.send(tag ? JSON.parse(tag) : 'Tag not found.');
	}

	private async add(msg: Message, args: Args) {
		const trigger = await args.pick('string');
		const response = await args.rest('message').catch(() => args.pick('string'));
		const data =
			response instanceof Message
				? JSON.stringify({ content: response.content, embeds: response.embeds, components: response.components })
				: JSON.stringify(response);

		await msg.client.tags.add(trigger, data);
		return msg.reply(`Tag added with name \`${trigger}\``);
	}

	private async delete(msg: Message, args: Args) {
		const name = await args.rest('string');
		const tag = msg.client.tags.get(name);
		if (!tag) return msg.reply('Tag not found.');
		await msg.client.tags.delete(name);
		return msg.reply('Tag deleted.');
	}
}
