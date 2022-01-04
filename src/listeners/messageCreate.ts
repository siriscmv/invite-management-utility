import { Listener } from '@sapphire/framework';
import { Message, MessageEmbed, TextChannel } from 'discord.js';
import log from '../utils/log';
import { emotes } from '../utils/emotes';
import config from '../config.json';
import sleep from '../utils/sleep';

export class MessageCreateListener extends Listener {
	inviteRegex = /(https?:\/\/)?(www\.)?(discord\.(gg|io|me|li)|discordapp\.com\/invite)\/.+[a-z]/gi;
	urlRegex = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/gi;

	public async run(msg: Message) {
		if (msg.author.bot || msg.webhookId || msg.guildId !== config.mainServer) return;

		if (msg.channelId === config.boostChannel) {
			const msgs = await msg.channel.messages.fetch();
			(msg.channel as TextChannel).bulkDelete(msgs.filter((m) => m.author.id === msg.client.user!.id));
			if (msg.system) {
				msg.channel.send(
					`${msg.author} Thank you for boosting!, make a ticket in <#874646469506895872> to claim your perks.`
				);
			}
			const embed = new MessageEmbed()
				.setColor('#e659f3')
				.setTitle('Boost Perks')
				.setDescription(
					`${emotes.boost} [Click here](https://discord.com/channels/874644312200212500/906882529896853554/906882563824582667)`
				);

			msg.channel.send({ embeds: [embed] });
		}

		if (this.inviteRegex.test(msg.content)) {
			if (!msg.member?.permissions.has('MANAGE_MESSAGES')) {
				await msg.delete();
				log('INVITE_LINK', msg);
				const res = await msg.member?.timeout(30 * 1000, 'Sending Invite links');
				if (res) {
					const embed: MessageEmbed = new MessageEmbed()
						.setAuthor({
							name: msg.author.tag,
							iconURL: msg.author.displayAvatarURL({ dynamic: true })
						})
						.setDescription(`${emotes.timeout} ${msg.author} has been timed out for 30s`)
						.addField('Reason', 'Sending Invite links', true);

					await msg.channel.send({ embeds: [embed] });
				}
			}
		}

		if (this.urlRegex.test(msg.content) && msg.content.toLowerCase().includes('nitro')) {
			if (!msg.member?.permissions.has('MANAGE_MESSAGES')) {
				await msg.delete();
				log('SCAM_LINK', msg);

				const res = await msg.member?.timeout(6 * 60 * 60 * 1000, 'Sending Scam nitro links');
				if (res) {
					const embed: MessageEmbed = new MessageEmbed()
						.setAuthor({
							name: msg.author.tag,
							iconURL: msg.author.displayAvatarURL({ dynamic: true })
						})
						.setDescription(`${emotes.timeout} ${msg.author} has been timed out for 6h`)
						.addField('Reason', 'Sending Scam nitro links', true);

					await msg.channel.send({ embeds: [embed], content: `${msg.author} please reset your password asap` });
				}
			}
		}

		if (config.blacklistedWords.some((word) => msg.content.toLowerCase().includes(word))) {
			if (!msg.member?.permissions.has('MANAGE_MESSAGES')) {
				await msg.delete();
				log('BLACKLISTED', msg);
				const res = await msg.channel.send(`${msg.author}, Your message contained a blacklisted word.`);
				sleep(5 * 1000);
				res.delete();
			}
		}
	}
}
