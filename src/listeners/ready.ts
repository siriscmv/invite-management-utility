import { Listener } from '@sapphire/framework';
import type { Client } from 'discord.js';
import { mainServer } from '../config.json';

export class ReadyListener extends Listener {
	public constructor(context: Listener.Context, options: Listener.Options) {
		super(context, {
			...options,
			once: true,
			event: 'ready'
		});
	}

	public async run(client: Client) {
		const { tag, id } = client.user!;
		this.container.logger.info(`Successfully logged in as ${tag} (${id})`);
		await client.guilds.cache.get(mainServer)?.members.fetch({ withPresences: true });
	}
}
