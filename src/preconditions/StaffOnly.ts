import { Precondition } from '@sapphire/framework';
import type { Message } from 'discord.js';
import { owners, mainServer, staffRoles } from '../config.js';

export class StaffOnlyPrecondition extends Precondition {
	public async run(message: Message) {
		return owners.includes(message.author.id) ||
			(message.guildId === mainServer &&
				(message.member?.permissions.has('ADMINISTRATOR') ||
					staffRoles.some((r) => message.member?.roles.cache.has(r))))
			? this.ok()
			: this.error({ message: 'This command can only be used by staff members.' });
	}
}

declare module '@sapphire/framework' {
	interface Preconditions {
		StaffOnly: never;
	}
}
