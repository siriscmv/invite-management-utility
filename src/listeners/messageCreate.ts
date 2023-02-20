import { Message, MessageActionRow, MessageButton, MessageEmbed, TextChannel, WebhookClient } from 'discord.js';
import { emotes } from '../utils/emotes.js';
import * as config from '../config.js';

export async function run(msg: Message): Promise<undefined> {
	if (msg.author.bot || msg.webhookId || msg.guildId !== config.mainServer) return;

	if (msg.channelId === config.boostChannel && !msg.author.bot) {
		const msgs = await msg.channel.messages.fetch();
		(msg.channel as TextChannel).bulkDelete(msgs.filter((m) => m.author.id === msg.client.user!.id));
		if (msg.system) {
			msg.channel.send(
				`${msg.author} Thank you for boosting!, make a ticket in <#${config.ticketChannel}> to claim your perks.`
			);
		}
		const embed = new MessageEmbed().setColor('#f5c2e7').setTitle('Boost Perks');

		const button = new MessageButton()
			.setStyle('LINK')
			.setURL(`${config.boostPerks}`)
			.setEmoji(`${emotes.boost}`)
			.setLabel('Click here');

		const comp = new MessageActionRow().setComponents([button]);

		msg.channel.send({ embeds: [embed], components: [comp] });
	}

	if (msg.content.startsWith(msg.client.tags.prefix)) {
		const trigger = msg.content.slice(msg.client.tags.prefix.length);
		const data = msg.client.tags.get(trigger);
		if (data) msg.reply(JSON.parse(data));
	}
}
