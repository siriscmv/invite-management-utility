import { Args, Command } from '@sapphire/framework';
import type { Message } from 'discord.js';

export class StealCommand extends Command {
	public constructor(context: Command.Context, options: Command.Options) {
		super(context, {
			...options,
			name: 'steal',
			aliases: ['add'],
			description: 'Steal emojis or stickers',
			options: ['type'],
			requiredUserPermissions: 'MANAGE_EMOJIS_AND_STICKERS'
		});
	}

	public async messageRun(msg: Message, args: Args) {
		const stickers = await args.pick('sticker').catch(() => []);
		const emojis = await args.repeat('emoji').catch(() => []);
		const images = await args.pick('image').catch(() => []);

		const type = args.getOption('type');

		if (images) {
			if (type?.toLowerCase() === 'emoji') {
				if (images.length) {
					images.forEach((img) => {
						msg.guild?.emojis.create(img.url, img.description ?? img.name ?? 'temp');
					});
					return msg.reply(`Adding ${images.length} images as emojis`);
				}
			} else if (type?.toLowerCase() === 'sticker') {
				if (images.length) {
					images.forEach((img) => {
						msg.guild?.stickers.create(img, img.description ?? img.name ?? 'temp', '😄');
					});
				}
				return msg.reply(`Adding ${images.length} images as stickers`);
			} else return msg.reply('Specify a type using `--type=emoji` or `--type=sticker`');
		}

		if (type?.toLowerCase() === 'emoji') {
			stickers.forEach((s) => {
				msg.guild?.emojis.create(s.url, s.name);
			});
			msg.reply(`Adding ${stickers.length} stickers as emojis`);
			if (emojis.length) {
				emojis.forEach((e) => {
					msg.guild?.emojis.create(e.url, e.name ?? 'temp');
				});
				msg.reply(`Adding ${emojis.length} emojis`);
			}
		} else if (type?.toLowerCase() === 'sticker') {
			stickers.forEach((s) => {
				msg.guild?.emojis.create(s.url, s.name);
			});
			msg.reply(`Adding ${stickers.length} stickers`);
			if (emojis.length) {
				emojis.forEach((e) => {
					msg.guild?.emojis.create(e.url, e.name ?? 'temp');
				});
				msg.reply(`Adding ${emojis.length} emojis as stickers`);
			}
		}

		return msg.reply('Done!');
	}
}
