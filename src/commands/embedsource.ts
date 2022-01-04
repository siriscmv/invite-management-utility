import { Args, Command } from '@sapphire/framework';
import { Message, MessageEmbed } from 'discord.js';

export class EmbedSourceCommand extends Command {
	public constructor(context: Command.Context, options: Command.Options) {
		super(context, {
			...options,
			name: 'embedsource',
			aliases: ['raw', 'es', 'restore'],
			description: 'Get the raw json of any message',
			flags: ['clean']
		});
	}

	public async messageRun(msg: Message, args: Args) {
		const m = await args.pick('message').catch(() => {});
		if (!m) return msg.reply('Please provide a message to get the source of.');

		const raw = {
			content: m.content,
			embeds: m.embeds.map((e) => e.toJSON()),
			components: m.components.map((c) => c.toJSON())
		};

		const json = JSON.stringify(args.getFlags('clean') ? this.clean(raw) : raw);

		return msg.reply({
			embeds: [
				new MessageEmbed()
					.setTitle('Raw JSON')
					.addField('Source', `[Click here](${m.url})`, true)
					.addField('Cleaned', `${args.getFlags('clean')}`, true)
					.addField('Length', `${json.length} characters`, true)
			],
			files: [
				{
					attachment: Buffer.from(json),
					name: `${m.id}.json`
				}
			]
		});
	}

	private clean(object: any): {} {
		Object.entries(object).forEach(([k, v]) => {
			if (v && typeof v === 'object') {
				this.clean(v);
			}
			if ((v && typeof v === 'object' && !Object.keys(v).length) || v === null || v === undefined) {
				if (Array.isArray(object)) {
					object.splice(parseInt(k), 1);
				} else {
					delete object[k];
				}
			}
		});
		return object;
	}
}
