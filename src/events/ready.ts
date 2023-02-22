import { Client, OverwriteType, PermissionFlagsBits, TextChannel } from 'discord.js';
import { mainServer, rolesMenu } from '../config.js';
import Ticket, { tickets } from '../utils/Ticket.js';

export async function run(client: Client) {
	const { tag, id } = client.user!;
	console.log(`Successfully logged in as ${tag} (${id})`);
	await client.guilds.cache.get(mainServer)?.members.fetch({ withPresences: true });
	await (client.channels.cache.get(rolesMenu.channel) as TextChannel).messages.fetch(rolesMenu.message);

	const server = client.guilds.cache.get(mainServer)!;
	const ticketChannels = server.channels.cache
		.filter(
			(c) =>
				c.parentId === '874647974075060305' &&
				!c.permissionsFor('903185636482240582')?.has(PermissionFlagsBits.ViewChannel)
		)
		.map((c) => c as TextChannel);

	for (const ticket of ticketChannels) {
		const ticketAuthor = ticket.permissionOverwrites.cache.find((p) => p.type === OverwriteType.Member)?.id;
		if (!ticketAuthor) continue;
		const t = new Ticket(
			parseInt(ticket.name.split('-')[1] ?? '0'),
			await client.users.fetch(ticketAuthor),
			ticket,
			ticket.topic!
		);
		tickets.set(ticketAuthor, t);
	}
}
