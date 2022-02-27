import { Listener } from '@sapphire/framework';
import type { GuildMember } from 'discord.js';
import { mainServer } from '../config.js';

export class GuildMemberAddListener extends Listener {
	public async run(member: GuildMember) {
		if (member.guild.id !== mainServer) return;
		/*
		if (((member.client.db?.get('autoKickBypass') ?? []) as string[]).includes(member.id)) return;

		const user = await member.user.fetch();
		if ((user.avatar && user.avatar.startsWith('a_')) || user.banner) return;
		
		if (Date.now() - user.createdTimestamp < user.client.db.get('altAge')!) {
			await user
				.send(
					`You were Banned from ${member.guild.name}, since your account is too young.\nYou may join https://discord.gg/dcSQfdNr8s and ping a staff member if you wish to get unbanned`
				)
				.catch(() => {});
			member.ban({ reason: 'Account too young' }).catch(() => {});
		}
		*/
	}
}
