import { Message, TextChannel, EmbedBuilder } from 'discord.js';
import { Command } from '../utils/commands.js';

const command: Command = {
	name: 'embedsource',
	aliases: ['raw', 'es', 'restore'],
	run: async (msg: Message) => {
		const targetMessage = msg.reference?.messageId ? await msg.fetchReference() : await parseArg(msg);
		if (!targetMessage) return msg.reply('Use a msg link/id or reply to an existing message');

		const raw = {
			content: targetMessage.content,
			embeds: targetMessage.embeds.map((e) => e.toJSON()),
			components: targetMessage.components.map((c) => c.toJSON())
		};

		const json = JSON.stringify(clean(raw), null, '\t');

		return msg.reply({
			embeds: [
				new EmbedBuilder().setTitle('Raw JSON').addFields([
					{ name: 'Source', value: `[Click here](${targetMessage.url})`, inline: true },
					{ name: 'Length', value: `${json.length} characters`, inline: true }
				])
			],
			files: [
				{
					attachment: Buffer.from(json),
					name: `${targetMessage.id}.json`
				}
			]
		});
	}
};

export default command;

const parseArg = async (msg: Message) => {
	const arg = msg.content.split(' ')[1];
	if (/\d+/.test(arg)) return (await (msg.channel as TextChannel).messages.fetch(arg).catch(() => null)) ?? null;
	else return false; //TODO: Parse URL here
};

const clean = (object: any) => {
	Object.entries(object).forEach(([k, v]) => {
		if (v && typeof v === 'object') {
			clean(v);
		}
		if (
			(v && typeof v === 'object' && !Object.keys(v).length) ||
			v === null ||
			v === undefined ||
			['type', 'components', 'proxyURL', 'height', 'width'].includes(k)
		) {
			if (Array.isArray(object)) {
				object.splice(parseInt(k), 1);
			} else {
				delete object[k];
			}
		}
	});
	return object;
};
