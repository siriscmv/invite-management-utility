import { GuildMember, EmbedBuilder, TextChannel } from 'discord.js';
import { tickets } from '../utils/Ticket.js';
import { mainServer, boostLogs, boosterRole, logChannel, red } from '../config.js';

export default function run(member: GuildMember) {
	if (member.guild.id !== mainServer) return;
	const { client } = member;
	const boostLog = client.channels.cache.get(boostLogs) as TextChannel;
	const log = client.channels.cache.get(logChannel) as TextChannel;

	const baseEmbed = new EmbedBuilder()
		.setAuthor({ name: member.user.tag, iconURL: member.user.displayAvatarURL() })
		.setFooter({ text: member.id });

	log.send({
		embeds: [
			baseEmbed
				.setColor(red)
				.setTitle('Member Left')
				.setDescription(`・${member}\n・Joined <t:${Math.round((member.joinedTimestamp ?? 0) / 1000)}:R>`)
		]
	});

	if (tickets.has(member.id)) tickets.get(member.id)!.delete(member, 'User left the server');

	if (member.roles.cache.has(boosterRole) || member.premiumSince) {
		boostLog.send({
			embeds: [
				baseEmbed
					.setColor(red)
					.setTitle('Booster Left')
					.setDescription(
						`・${member}\n・Started boosting <t:${Math.round((member.premiumSinceTimestamp ?? 0) / 1000)}:R>`
					)
			]
		});
	}
}