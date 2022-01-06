import { Listener } from '@sapphire/framework';
import type { GuildMember } from 'discord.js';
import { mainServer } from '../config.json';
import sleep from '../utils/sleep';
import config from '../config.json';

export class GuildMemberAddListener extends Listener {
	public async run(member: GuildMember) {
		if (member.guild.id !== mainServer) return;

		await sleep(5 * 1000);

		member.client.db?.get('autoKickBypass')?.

		if (!member.roles.cache.has(config.verifiedRole) && !member.premiumSince) {
			await member.send(
				`You were kicked from ${
					member.guild.name
				} for not completing the verification process time.\nYou can join again using this link: ${
					member.guild.vanityURLCode ? `discord.gg/${member.guild.vanityURLCode}` : ''
				}`
			);
			member.kick('Did not verify in time').catch(() => {});
		}
	}
}
