import { Listener } from '@sapphire/framework';
import type { Presence, TextChannel } from 'discord.js';
import { mainBot, logs, owners } from '../config.json';

export class PresenceUpdateListener extends Listener {
	public async run(oldPresence: Presence, newPresence: Presence) {
		if (newPresence.user?.id !== mainBot) return;
		if (oldPresence.status && (!newPresence || newPresence.status === 'offline'))
			return (oldPresence.client.channels.cache.get(logs)! as TextChannel).send({
				content: `${owners.map((id) => `<@${id}>`).join(', ')} | ${oldPresence.user?.tag} has gone offline.`
			});
		if (!oldPresence && newPresence.status)
			return (newPresence.client.channels.cache.get(logs)! as TextChannel).send({
				content: `${owners.map((id) => `<@${id}>`).join(', ')} | ${newPresence.user?.tag} has come online.`
			});
	}
}
