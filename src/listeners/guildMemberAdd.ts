import { Listener } from '@sapphire/framework';
import type { GuildMember } from 'discord.js';
import { mainServer } from '../config.json';
import sleep from '../utils/sleep';
import config from '../config.json';

export class GuildMemberAddListener extends Listener {
	public async run(member: GuildMember) {
		if (member.guild.id !== mainServer) return;

		await sleep(60 * 1000);

		if (!member.roles.cache.has(config.verifiedRole) && !member.premiumSince)
			member.kick('Did not verify in time').catch(() => {});
	}
}
