import { Listener } from '@sapphire/framework';
import type { GuildMember } from 'discord.js';
import { mainBot, mainServer, verifiedRole } from '../config.js';
import removeAccents from 'remove-accents'; //@ts-ignore
import unorm from 'unorm'; //@ts-ignore
import latinize from 'latinize'; //@ts-ignore
import unidecode from 'unidecode';

const { nfkc } = unorm;
export class GuildMemberAddListener extends Listener {
	public async run(member: GuildMember) {
		if (member.guild.id !== mainServer) return;
		const bot = member.guild.members.cache.get(mainBot)!;
		if (!bot.presence || bot.presence.status === 'offline') member.roles.add(verifiedRole);
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

		const deCancer = this.decancer(member.displayName);
		if (deCancer) await member.setNickname(deCancer);
		else return;

		const deHoist = this.dehoist(member.displayName);
		if (deHoist) await member.setNickname(deHoist);
		else return;
	}

	private decancer(name: string) {
		if (/^[\x00-\xFF]*$/im.test(name)) return null;
		const sanitized: string = unidecode(nfkc(latinize(removeAccents(name)))).replace(/\[\?\]/g, '') || '';

		if (sanitized.length > 2 && sanitized.length < 32) return sanitized;
		return 'Moderated nickname';
	}

	private dehoist(name: string): string | null {
		const isHoisted = (name: string) =>
			name[0] < '0' || ['"', '(', "'", '<', '>', '=', '[', '>', '?'].includes(name[0]);

		if (!isHoisted(name)) return null;
		return name.length ? (isHoisted(name) ? this.dehoist(name.substring(1)) : name) : `Moderated nickname`;
	}
}
