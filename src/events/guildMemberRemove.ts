import { GuildMember, EmbedBuilder, TextChannel } from 'discord.js';
import { tickets } from '../utils/Ticket.js';
import { mainServer, boostLogs, boosterRole, logChannel, red } from '../config.js';
import humanizeDuration from 'humanize-duration';

export default async function run(member: GuildMember) {
	if (member.guild.id !== mainServer) return;
	const { client } = member;
	const boostLog = client.channels.cache.get(boostLogs) as TextChannel;
	const log = client.channels.cache.get(logChannel) as TextChannel;

	const baseEmbed = new EmbedBuilder()
		.setAuthor({ name: member.user.tag, iconURL: member.user.displayAvatarURL() })
		.setFooter({ text: member.id });

	await log.send({
		embeds: [
			baseEmbed
				.setColor(red)
				.setTitle('Member Left')
				.addFields([
					{
						name: 'Member Joined',
						value: `<t:${Math.round((member.joinedTimestamp ?? 0) / 1000)}:R>`,
						inline: true
					},
					{
						name: 'Member Count',
						value: member.guild.memberCount.toLocaleString(),
						inline: true
					},
					{
						name: 'Duration of Stay',
						value: humanizeDuration(Date.now() - member.joinedTimestamp!, { largest: 3 }),
						inline: true
					}
				])
		]
	});

	if (tickets.has(member.id)) tickets.get(member.id)!.delete(member.guild!.members.me!, 'User left the server');

	if (member.roles.cache.has(boosterRole) || member.premiumSince) {
		await boostLog.send({
			embeds: [
				baseEmbed
					.setColor(red)
					.setTitle('Booster Left')
					.setFields([])
					.setDescription(
						`・${member}\n・Started boosting <t:${Math.round((member.premiumSinceTimestamp ?? 0) / 1000)}:R>`
					)
			]
		});
	}
}
