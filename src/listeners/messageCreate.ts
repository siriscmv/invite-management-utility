import {
	Message,
	TextChannel,
	EmbedBuilder,
	ButtonBuilder,
	ButtonStyle,
	ActionRowBuilder,
	MessageActionRowComponentBuilder
} from 'discord.js';
import { emotes } from '../utils/emotes.js';
import { boostChannel, ticketChannel, mainServer, boostPerks } from '../config.js';

export async function run(msg: Message): Promise<undefined> {
	if (msg.author.bot || msg.webhookId || msg.guildId !== mainServer) return;

	if (msg.channelId === boostChannel) {
		const channel = msg.channel as TextChannel;
		const msgs = await channel.messages.fetch();
		channel.bulkDelete(msgs.filter((m) => m.author.id === msg.client.user!.id));
		if (msg.system) {
			channel.send(`${msg.author} Thank you for boosting!, make a ticket in <#${ticketChannel}> to claim your perks.`);
		}
		const embed = new EmbedBuilder().setColor('#f5c2e7').setTitle('Boost Perks');

		const button = new ButtonBuilder()
			.setStyle(ButtonStyle.Link)
			.setURL(`${boostPerks}`)
			.setEmoji(`${emotes.boost}`)
			.setLabel('Click here');

		const comp = new ActionRowBuilder<MessageActionRowComponentBuilder>().setComponents([button]);

		channel.send({ embeds: [embed], components: [comp] });
	}

	if (msg.content.startsWith(msg.client.tags.prefix)) {
		const trigger = msg.content.slice(msg.client.tags.prefix.length);
		const data = msg.client.tags.get(trigger);
		if (data) msg.reply(JSON.parse(data));
	}
}
