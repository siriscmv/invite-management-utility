import { GuildMember, EmbedBuilder, TextChannel } from 'discord.js';
import { mainServer, boostLogs, green, red, logChannel, peach } from '../config.js';

export default async function run(oldMember: GuildMember, newMember: GuildMember) {
	if (oldMember.guild.id !== mainServer) return;

	const boostLog = newMember.client.channels.cache.get(boostLogs) as TextChannel;
	const log = newMember.client.channels.cache.get(logChannel) as TextChannel;

	const baseEmbed = new EmbedBuilder()
		.setAuthor({ name: newMember.user.tag, iconURL: newMember.user.displayAvatarURL() })
		.setDescription(newMember.toString())
		.setThumbnail(newMember.user.displayAvatarURL())
		.setFooter({ text: newMember.id });

	const roles = {
		added: newMember.roles.cache.filter((r) => !oldMember.roles.cache.has(r.id)),
		removed: oldMember.roles.cache.filter((r) => !newMember.roles.cache.has(r.id))
	};

	const fields = [
		roles.added.size > 0
			? {
					name: 'Roles Added',
					value: roles.added.map((r) => r.toString()).join(' ')
			  }
			: null,
		roles.removed.size > 0
			? {
					name: 'Roles Removed',
					value: roles.removed.map((r) => r.toString()).join(' ')
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

	if (fields.length > 0) {
		await log.send({
			embeds: [
				new EmbedBuilder(baseEmbed.data)
					.setColor(peach)
					.setTitle('Member Updated')
					.setTimestamp(Date.now())
					.addFields(fields)
			]
		});
	}

	if (oldMember.premiumSinceTimestamp && !newMember.premiumSinceTimestamp) {
		await boostLog.send({
			embeds: [
				new EmbedBuilder(baseEmbed.data)
					.setColor(red)
					.setTitle('Member Unboosted')
					.setFields([
						{
							name: 'Started Boosting',
							value: `<t:${Math.round(oldMember.premiumSinceTimestamp / 1000)}:R>`
						}
					])
			]
		});
	} else if (!oldMember.premiumSinceTimestamp && newMember.premiumSinceTimestamp) {
		await boostLog.send({
			embeds: [
				new EmbedBuilder(baseEmbed.data)
					.setColor(green)
					.setTitle('Member Boosted')
					.setFields([
						{
							name: 'Started Boosting',
							value: `<t:${Math.round(Date.now() / 1000)}:R>`
						}
					])
			]
		});
	}
}
