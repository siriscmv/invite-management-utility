import { Client, OverwriteType, PermissionFlagsBits, TextChannel } from 'discord.js';
import { mainServer, rolesMenu } from '../config.js';
import Ticket from '../utils/Ticket.js';

export async function run(client: Client) {
	const { tag, id } = client.user!;
	console.log(`Successfully logged in as ${tag} (${id})`);
	await client.guilds.cache.get(mainServer)?.members.fetch({ withPresences: true });
	await (client.channels.cache.get(rolesMenu.channel) as TextChannel).messages.fetch(rolesMenu.message);
	await client.db._init();
	await client.tags._init();

	const server = client.guilds.cache.get(mainServer)!;
	const tickets = server.channels.cache
		.filter(
			(c) =>
				c.parentId === '874647974075060305' &&
				!c.permissionsFor('903185636482240582')?.has(PermissionFlagsBits.ViewChannel)
		)
		.map((c) => c as TextChannel);

	for (const ticket of tickets) {
		const ticketAuthor = ticket.permissionOverwrites.cache.find((p) => p.type === OverwriteType.Member)?.id;
		if (!ticketAuthor) continue;
		const t = new Ticket(null, ticket, await client.users.fetch(ticketAuthor));
		client.tickets.set(ticketAuthor, t);
	}
}
