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
import {
	boostChannel,
	ticketChannel,
	mainServer,
	boostPerks,
	prefix,
	tagPrefix,
	mauve,
	aiSupportChannel
} from '../config.js';
import commands from './../utils/commands.js';
import tags from './../utils/tags.js';

export default async function run(msg: Message): Promise<undefined> {
	if (msg.author.bot || msg.webhookId || msg.guildId !== mainServer) return;

	if (msg.content.startsWith(prefix)) {
		const commandName = msg.content.slice(prefix.length).trim().split(/ +/).shift()!.toLowerCase();
		const command = commands.get(commandName) || commands.find((c) => c.aliases?.includes(commandName));
		if (!command) return;
		if (command.shouldRun) {
			const shouldRun = await command.shouldRun(msg);
			if (shouldRun === true) {
				await command.run(msg);
			} else {
				msg.reply(typeof shouldRun === 'string' ? shouldRun : 'You do not have permission to run this command');
			}
		} else {
			await command.run(msg);
		}
	}

	if (msg.content.startsWith(tagPrefix)) {
		const trigger = msg.content.slice(tagPrefix.length);
		const response = tags.get(trigger);
		if (response) msg.reply(response);
	}

	if (msg.channelId === boostChannel) {
		const channel = msg.channel as TextChannel;
		const msgs = await channel.messages.fetch();
		channel.bulkDelete(msgs.filter((m) => m.author.id === msg.client.user!.id));
		if (msg.system) {
			channel.send(`${msg.author} Thank you for boosting!, make a ticket in <#${ticketChannel}> to claim your perks.`);
		}
		const embed = new EmbedBuilder().setColor(mauve).setTitle('Boost Perks');

		const button = new ButtonBuilder()
			.setStyle(ButtonStyle.Link)
			.setURL(`${boostPerks}`)
			.setEmoji(`${emotes.boost}`)
			.setLabel('Click here');

		const comp = new ActionRowBuilder<MessageActionRowComponentBuilder>().setComponents([button]);

		channel.send({ embeds: [embed], components: [comp] });
	}

	if (msg.channelId === aiSupportChannel) {
		await msg.channel.sendTyping();

		const result = await fetch(process.env.AI_ASK_URL!, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ query: msg.content })
		});

		if (!result.ok) {
			await msg.react('⚠️');
			return;
		}

		const data = await result.json();
		if (data?.answer?.text) await msg.reply(data.answer.text);
		else await msg.reply('😕');
	}
}
