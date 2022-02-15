import { Listener } from '@sapphire/framework';
import type { BaseGuildTextChannel, Client } from 'discord.js';
import { mainServer } from '../config.js';
import { Ticket } from '../structures/Ticket.js';

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
		await client.db._init();
		await client.tags._init();
		await client.knowledgeBase._init();

		const server = client.guilds.cache.get(mainServer)!;
		const tickets = server.channels.cache
			.filter(
				(c) => c.parentId === '874647974075060305' && !c.permissionsFor('903185636482240582')?.has('VIEW_CHANNEL')
			)
			.map((c) => c as BaseGuildTextChannel);

		for (const ticket of tickets) {
			const ticketAuthor = ticket.permissionOverwrites.cache.find((p) => p.type === 'member')?.id;
			if (!ticketAuthor) continue;
			const t = new Ticket(client, null, ticket, await client.users.fetch(ticketAuthor));
			client.tickets.set(ticketAuthor, t);
		}
	}
}
