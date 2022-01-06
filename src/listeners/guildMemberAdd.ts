import { Listener } from '@sapphire/framework';
import type { GuildMember } from 'discord.js';
import { mainServer } from '../config.json';
import sleep from '../utils/sleep';

export class GuildMemberAddListener extends Listener {
	public async run(member: GuildMember) {
		if (member.guild.id !== mainServer) return;

		if (((member.client.db?.get('autoKickBypass') ?? []) as string[]).includes(member.id)) return;

		await sleep(5 * 1000);

		if (Date.now() - member.user.createdTimestamp < member.client.db.get('altAge')!) {
			await member
				.send(
					`You were kicked from ${
						member.guild.name
					} Since your account is too young.\nDM a support staff from: discord.gg${
						member.guild.vanityURLCode ?? 'TGUgy93RUY'
					} to get bypass`
				)
				.catch(() => {});
			member.kick('Account too young').catch(() => {});
		}
	}
}
