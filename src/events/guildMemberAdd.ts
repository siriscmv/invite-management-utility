import { GuildMember, EmbedBuilder, TextChannel } from 'discord.js';
import { green, logChannel, mainServer, verifiedRole } from '../config.js';
import removeAccents from 'remove-accents'; //@ts-ignore
import unorm from 'unorm'; //@ts-ignore
import latinize from 'latinize'; //@ts-ignore
import unidecode from 'unidecode';

const { nfkc } = unorm;

export default async function run(member: GuildMember) {
	if (member.guild.id !== mainServer) return;

	await member.roles.add(verifiedRole);

	const log = member.client.channels.cache.get(logChannel)! as TextChannel;
	await log.send({
		embeds: [
			new EmbedBuilder()
				.setAuthor({ name: member.user.tag, iconURL: member.user.displayAvatarURL() })
				.setThumbnail(member.user.displayAvatarURL())
				.setFooter({ text: member.id })
				.setTitle('Member Joined')
				.setDescription(member.toString())
				.setColor(green)
				.addFields([
					{
						name: 'Account Created',
						value: `<t:${Math.round((member.user.createdTimestamp ?? 0) / 1000)}:R>`,
						inline: true
					},
					{
						name: 'Member Count',
						value: member.guild.memberCount.toLocaleString(),
						inline: true
					},
					{
						name: 'Rejoin',
						value: member.flags.has('DidRejoin') ? 'Yes' : 'No',
						inline: true
					}
				])
		]
	});

	const name = member.nickname ?? member.user.username;
	const normalized = dehoist(decancer(name));
	if (normalized !== name) await member.setNickname(normalized);
}

const decancer = (name: string) => {
	if (/^[\x00-\xFF]*$/im.test(name)) return name;
	const sanitized: string = unidecode(nfkc(latinize(removeAccents(name)))).replace(/\[\?\]/g, '') || 'gibberish';

	if (sanitized.length > 2 && sanitized.length < 32 && sanitized !== 'gibberish') return sanitized;
	return 'Moderated nickname';
};

const dehoist = (name: string): string | null => {
	if (!(name[0] < '0')) return name;
	else return strip(name);
};

const strip = (name: string): string =>
	name.length
		? name[0] < '0' || ['"', '(', "'", '<', '>', '=', '[', '>', '?'].includes(name[0])
			? strip(name.substring(1))
			: name
		: 'Moderated nickname';
