import { Args, Command } from '@sapphire/framework';
import type { Message } from 'discord.js';

export class StealCommand extends Command {
	public constructor(context: Command.Context, options: Command.Options) {
		super(context, {
			...options,
			name: 'addmultiple',
			description: 'Steal multiple emojis or stickers',
			options: ['type'],
			requiredUserPermissions: 'MANAGE_EMOJIS_AND_STICKERS'
		});
	}

	addedSome = false;

	public async messageRun(msg: Message, args: Args) {
		const stickers = msg.stickers.map((s) => s);
		const emojis = await args.repeat('emoji').catch(() => []);
		const images = msg.attachments.filter((a) => a.contentType?.startsWith('image/') ?? false).map((a) => a);

		const type = args.getOption('type');

		if (images.length) {
			if (type?.toLowerCase() === 'emoji')
				images.forEach((img) => this.addEmoji(msg, img.url, img.description ?? img.name ?? 'temp'));
			else if (type?.toLowerCase() === 'sticker') {
				images.forEach((img) => this.addSticker(msg, img.url, img.description ?? img.name ?? 'temp'));
			} else return msg.reply('Specify a type using `--type=emoji` or `--type=sticker`');
		}

		if (type?.toLowerCase() === 'emoji') {
			if (stickers.length) stickers.forEach((s) => this.addEmoji(msg, s.url, s.name));

			if (emojis.length) emojis.forEach((e) => this.addEmoji(msg, e.url as string, e.name ?? 'temp'));
		} else if (type?.toLowerCase() === 'sticker') {
			if (stickers.length) stickers.forEach((s) => this.addSticker(msg, s.url, s.name));

			if (emojis.length) emojis.forEach((e) => this.addSticker(msg, e.url as string, e.name ?? 'temp'));
		} else {
			if (stickers.length) stickers.forEach((s) => this.addSticker(msg, s.url, s.name));

			if (emojis.length) emojis.forEach((e) => this.addEmoji(msg, e.url as string, e.name ?? 'temp'));
		}

		if (!this.addedSome) return msg.reply('Unable to parse emojis or stickers.');
		else return;
	}

	private addSticker(msg: Message, url: string, name: string) {
		msg.guild!.stickers.create(url, name, '🙂').then((s) => {
			msg.reply({ content: `Added ${s.name}`, stickers: [s] });
			this.addedSome = true;
		});
	}

	private addEmoji(msg: Message, url: string, name: string) {
		msg.guild!.emojis.create(url, name).then((e) => {
			msg.reply({ content: `Added ${e}` });
			this.addedSome = true;
		});
	}
}
