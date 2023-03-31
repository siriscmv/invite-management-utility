import type { Presence, TextChannel } from 'discord.js';
import { uptimeLogs, owners, mainServer, mainBot } from '../config.js';

export default async function run(oldPresence: Presence, newPresence: Presence) {
	if (newPresence.userId !== mainBot || newPresence.guild?.id !== mainServer) return;
	if (oldPresence && ['offline', 'invisible'].includes(newPresence.status))
		(oldPresence.client.channels.cache.get(uptimeLogs)! as TextChannel).send({
			content: `<:noCross:927910058287857755> | <@&1091349273536385096> | ${oldPresence.user?.tag} has gone offline.`
		});
	else if (
		(!oldPresence || ['offline', 'invisible'].includes(oldPresence.status)) &&
		!['offline', 'invisible'].includes(newPresence.status)
	)
		(newPresence.client.channels.cache.get(uptimeLogs)! as TextChannel).send({
			content: `<:YesTick:915291739063975966> | <@&1091349273536385096> | ${newPresence.user?.tag} has come online.`
		});
}
