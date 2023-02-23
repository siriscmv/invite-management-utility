import { GuildMember, EmbedBuilder, TextChannel } from 'discord.js';
import { mainServer, boostLogs, green, red, logChannel, peach } from '../config.js';

export default async function run(oldMember: GuildMember, newMember: GuildMember) {
	if (oldMember.guild.id !== mainServer) return;

	const boostLog = newMember.client.channels.cache.get(boostLogs) as TextChannel;
	const log = newMember.client.channels.cache.get(logChannel) as TextChannel;

	const baseEmbed = new EmbedBuilder()
		.setAuthor({ name: newMember.user.tag, iconURL: newMember.user.displayAvatarURL() })
		.setFooter({ text: newMember.id });

	const roles = {
		added: newMember.roles.cache.filter((r) => !oldMember.roles.cache.has(r.id)),
		removed: oldMember.roles.cache.filter((r) => !newMember.roles.cache.has(r.id))
	};

	const fields = [
		roles.added.size > 0 || roles.removed.size > 0
			? {
					name: 'Roles',
					value: `${roles.added.size ? '+ ' : ''}${roles.added.map(toString).join(' ')}\n${
						roles.removed.size ? '- ' : ''
					}${roles.removed.map((r) => r.name).join(' ')}`
			  }
			: null,
		oldMember.nickname !== newMember.nickname
			? {
					name: 'Nickname',
					value: `${oldMember.displayName} → ${newMember.displayName}`
			  }
			: null,
		oldMember.communicationDisabledUntilTimestamp !== newMember.communicationDisabledUntilTimestamp
			? {
					name: 'Timeout',
					value: `${
						oldMember.communicationDisabledUntilTimestamp
							? `<t:${Math.round(oldMember.communicationDisabledUntilTimestamp / 1000)}:R>`
							: 'None'
					} → ${
						newMember.communicationDisabledUntilTimestamp
							? `<t:${Math.round(newMember.communicationDisabledUntilTimestamp / 1000)}:R>`
							: 'None'
					}`
			  }
			: null,
		oldMember.premiumSinceTimestamp !== newMember.premiumSinceTimestamp
			? {
					name: 'Boosting',
					value: `${
						oldMember.premiumSinceTimestamp ? `<t:${Math.round(oldMember.premiumSinceTimestamp / 1000)}:R>` : 'None'
					} → ${
						newMember.premiumSinceTimestamp ? `<t:${Math.round(newMember.premiumSinceTimestamp / 1000)}:R>` : 'None'
					}`
			  }
			: null
	].filter((f) => f !== null) as { name: string; value: string }[];

	await log.send({
		embeds: [
			new EmbedBuilder(baseEmbed.data)
				.setColor(peach)
				.setTitle('Member Updated')
				.setTimestamp(Date.now())
				.addFields(fields)
		]
	});

	if (oldMember.premiumSinceTimestamp && !newMember.premiumSinceTimestamp) {
		await boostLog.send({
			embeds: [
				baseEmbed
					.setColor(red)
					.setTitle('Member Unboosted')
					.setDescription(
						`・${newMember}/\n・Started boosting <t:${Math.round(oldMember.premiumSinceTimestamp / 1000)}:R>`
					)
			]
		});
	} else if (!oldMember.premiumSinceTimestamp && newMember.premiumSinceTimestamp) {
		await boostLog.send({
			embeds: [
				baseEmbed
					.setColor(green)
					.setTitle('Member Boosted')
					.setDescription(`・${newMember}\n・Started boosting <t:${Math.round(Date.now() / 1000)}:R>`)
			]
		});
	}
}
