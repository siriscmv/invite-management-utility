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
		const sticker = msg.stickers.first();
		const emoji = await args.pick('emoji').catch(() => null);
		const image = msg.attachments.filter((a) => a.contentType?.startsWith('image/') ?? false).first();

		const type = args.getOption('type');
		const name = await args.pick('string').catch(() => null);

		if (!sticker && !emoji && !type) return msg.reply('Specify a type using `--type=emoji` or `--type=sticker`');

		if (type?.toLowerCase() === 'emoji') {
			if (sticker) this.addEmoji(msg, sticker.url, name ?? sticker.name);
			else if (image) this.addEmoji(msg, image.url, name ?? image.description ?? image.name ?? 'temp');
		} else if (type?.toLowerCase() === 'sticker') {
			if (emoji) this.addSticker(msg, emoji.url, name ?? emoji.name ?? 'temp');
			else if (image) this.addSticker(msg, image.url, name ?? image.description ?? image.name ?? 'temp');
		} else {
			if (emoji) this.addEmoji(msg, emoji.url, name ?? emoji.name ?? 'temp');
			else if (sticker) this.addSticker(msg, sticker.url, name ?? sticker.name);
		}

		return;
	}

	private addSticker(msg: Message, url: string, name: string) {
		msg.guild!.stickers.create(url, name, '🙂').then((s) => {
			msg.reply({ content: `Added ${s.name}`, stickers: [s] });
		});
	}

	private addEmoji(msg: Message, url: string, name: string) {
		msg.guild!.emojis.create(url, name).then((e) => {
			msg.reply({ content: `Added ${e}` });
		});
	}
}
