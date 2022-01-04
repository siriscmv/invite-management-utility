import { Listener } from '@sapphire/framework';
import type { Presence, TextChannel } from 'discord.js';
import { logs, owners } from '../config.json';

export class PresenceUpdateListener extends Listener {
	public async run(oldPresence: Presence, newPresence: Presence) {
		if (newPresence.userId !== '581451736305106985') return;
		if (oldPresence?.status && (!newPresence || newPresence.status === 'offline'))
			(oldPresence.client.channels.cache.get(logs)! as TextChannel).send({
				content: `${owners.map((id) => `<@${id}>`).join(', ')} | ${oldPresence.user?.tag} has gone offline.`
			});
		else if (!oldPresence && newPresence.status)
			(newPresence.client.channels.cache.get(logs)! as TextChannel).send({
				content: `${owners.map((id) => `<@${id}>`).join(', ')} | ${newPresence.user?.tag} has come online.`
			});
	}
}
