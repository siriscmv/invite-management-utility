import type { Presence, TextChannel } from 'discord.js';
import { uptimeLogs, owners, mainServer, mainBot } from '../config.js';

export async function run(oldPresence: Presence, newPresence: Presence) {
	if (newPresence.userId !== mainBot || newPresence.guild?.id !== mainServer) return;
	if (oldPresence && ['offline', 'invisible'].includes(newPresence.status))
		(oldPresence.client.channels.cache.get(uptimeLogs)! as TextChannel).send({
			content: `<:noCross:927910058287857755> | ${owners.map((id) => `<@${id}>`).join(', ')} | ${
				oldPresence.user?.tag
			} has gone offline.`
		});
	else if (
		(!oldPresence || ['offline', 'invisible'].includes(oldPresence.status)) &&
		!['offline', 'invisible'].includes(newPresence.status)
	)
		(newPresence.client.channels.cache.get(uptimeLogs)! as TextChannel).send({
			content: `<:YesTick:915291739063975966> | ${owners.map((id) => `<@${id}>`).join(', ')} | ${
				newPresence.user?.tag
			} has come online.`
		});
}
