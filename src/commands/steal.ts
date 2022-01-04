import { Args, Command } from '@sapphire/framework';
import type { Message } from 'discord.js';

export class StealCommand extends Command {
	public constructor(context: Command.Context, options: Command.Options) {
		super(context, {
			...options,
			name: 'steal',
			description: 'Steal an emoji or sticker',
			options: ['type'],
			requiredUserPermissions: 'MANAGE_EMOJIS_AND_STICKERS'
		});
	}

	public async messageRun(msg: Message, args: Args) {
		const sticker = (await args.pick('sticker').catch(() => []))[0];
		const emoji = await args.pick('emoji').catch(() => null);
		const image = (await args.pick('image').catch(() => []))[0];

		const type = args.getOption('type');
		const name = await args.pick('string').catch(() => null);

		if (!sticker && !emoji && !type) return msg.reply('Specify a type using `--type=emoji` or `--type=sticker`');

		if (type?.toLowerCase() === 'emoji') {
			if (sticker) msg.guild?.emojis.create(sticker.url, name ?? sticker.name);
			else if (image) msg.guild?.emojis.create(image.url, name ?? image.description ?? image.name ?? 'temp');
		} else if (type?.toLowerCase() === 'sticker') {
			if (emoji) msg.guild?.stickers.create(emoji.url, name ?? emoji.name ?? 'temp', '');
			else if (image) msg.guild?.stickers.create(image.url, name ?? image.description ?? image.name ?? 'temp', '');
		} else {
			if (emoji) msg.guild?.emojis.create(emoji.url, name ?? emoji.name ?? 'temp');
			else if (sticker) msg.guild?.stickers.create(sticker.url, name ?? sticker.name, '');
		}

		return msg.reply('Done!');
	}
}
