import { Listener } from '@sapphire/framework';
import { ColorResolvable, Message, MessageEmbed, TextChannel } from 'discord.js';
import log from '../utils/log';
import { emotes } from '../utils/emotes';
import config from '../config.json';
import sleep from '../utils/sleep';

export class MessageCreateListener extends Listener {
	inviteRegex = /(https?:\/\/)?(www\.)?(discord\.(gg|io|me|li)|discordapp\.com\/invite)\/.+[a-z]/gi;
	urlRegex = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/gi;
	autoDelete = /[\u0900-\u097F]/gm;

	public async run(msg: Message) {
		if (msg.webhookId || msg.guildId !== config.mainServer) return;

		if ((msg.mentions.members?.size ?? 0) >= 5 && !msg.member?.permissions.has('MODERATE_MEMBERS')) {
			const res = await msg.member?.timeout(1 * 60 * 60 * 1000, 'Mass mentioning members');
			log('MASS_PING', msg);
			if (res) {
				const embed: MessageEmbed = new MessageEmbed()
					.setAuthor({
						name: msg.author.tag,
						iconURL: msg.author.displayAvatarURL({ dynamic: true })
					})
					.setColor(config.color as ColorResolvable)
					.setDescription(`${emotes.timeout} ${msg.author} has been timed out for 1h`)
					.addField('Reason', 'Mass mentioning members', true);

				await msg.channel.send({ embeds: [embed] });
			}
		}
		if (msg.channelId === config.boostChannel && !msg.author.bot) {
			const msgs = await msg.channel.messages.fetch();
			(msg.channel as TextChannel).bulkDelete(msgs.filter((m) => m.author.id === msg.client.user!.id));
			if (msg.system) {
				msg.channel.send(
					`${msg.author} Thank you for boosting!, make a ticket in <#${config.ticketChannel}> to claim your perks.`
				);
			}
			const embed = new MessageEmbed()
				.setColor('#e659f3')
				.setTitle('Boost Perks')
				.setDescription(`${emotes.boost} [Click here](${config.boostPerks})`);

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
						.setColor(config.color as ColorResolvable)
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
						.setColor(config.color as ColorResolvable)
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

		if (this.autoDelete.test(msg.content)) msg.delete();
	}
}
