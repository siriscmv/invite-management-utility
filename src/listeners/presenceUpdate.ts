import { Listener } from '@sapphire/framework';
import type { Presence, TextChannel } from 'discord.js';
import { uptimeLogs, owners, mainServer, mainBot } from '../config.js';

export class PresenceUpdateListener extends Listener {
	public async run(oldPresence: Presence, newPresence: Presence) {
		if (newPresence.userId !== mainBot || newPresence.guild?.id !== mainServer) return;
		if (oldPresence && (!newPresence || ['offline', 'invisible'].includes(newPresence.status)))
			(oldPresence.client.channels.cache.get(uptimeLogs)! as TextChannel).send({
				content: `${owners.map((id) => `<@${id}>`).join(', ')} | ${oldPresence.user?.tag} has gone offline.`
			});
		else if (
			(!oldPresence || ['offline', 'invisible'].includes(oldPresence.status)) &&
			!['offline', 'invisible'].includes(newPresence.status)
		)
			(newPresence.client.channels.cache.get(uptimeLogs)! as TextChannel).send({
				content: `${owners.map((id) => `<@${id}>`).join(', ')} | ${newPresence.user?.tag} has come online.`
			});
	}
}
