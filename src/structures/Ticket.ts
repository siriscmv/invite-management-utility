import type { SapphireClient } from '@sapphire/framework';
import { GuildMember, GuildTextBasedChannel, Message, MessageEmbed, ModalSubmitInteraction, User } from 'discord.js';
import { ticketLogsChannel, transcriptChannel } from '../config.js';
import { transcript } from '../utils/transcript.js';

export class Ticket {
	ticketNumber: number;
	user: User;
	channel: GuildTextBasedChannel | null;
	reason: string;

	constructor(client: SapphireClient, interaction: ModalSubmitInteraction) {
		const prev = client.db.get('ticketCounter') as number;
		client.db.set('ticketCounter', prev + 1);

		this.ticketNumber = prev + 1;
		this.user = interaction.user;
		this.channel = null;
		this.reason = interaction.components[0].components[0].value;
	}

	async delete(staff: GuildMember, reason: 'STAFF_DELETE' | 'AUTO_DELETE') {
		await this.log(staff);

		const reasons = {
			STAFF_DELETE: 'Ticket deleted by staff',
			AUTO_DELETE: 'Ticket deleted automatically'
		};

		const em = new MessageEmbed()
			.setAuthor({ name: this.user.tag, iconURL: this.user.displayAvatarURL({ dynamic: true }) })
			.setTitle(reasons[reason] ?? 'Ticket deleted')
			.setDescription(this.reason)
			.setFooter({ text: staff.user.tag, iconURL: staff.user.displayAvatarURL({ dynamic: true }) })
			.setTimestamp();

		await (staff.guild.channels.cache.get(ticketLogsChannel)! as GuildTextBasedChannel).send({ embeds: [em] });

		staff.client.tickets.delete(this.ticketNumber);
		return this.channel!.delete();
	}

	private async log(staff: GuildMember) {
		const msgsArray: Message[] = [];
		let last: string | null = null;
		let msgs: Message[] | null = null;

		do {
			msgs = (await this.channel!.messages.fetch({ after: last ?? '1' })).map((m) => m);
			if (!msgs || msgs.length === 0) break;

			const lastMsgID: string = msgs![msgs!.length - 1]?.id;
			if (last === lastMsgID) break;

			msgsArray.push(...msgs!);
			last = lastMsgID;
		} while (true);

		const data = await transcript(staff.client, this.ticketNumber, this.channel!.name, msgs);

		return await (staff.client.channels.cache.get(transcriptChannel) as GuildTextBasedChannel).send({
			files: [{ name: `ticket-${this.ticketNumber}.html`, attachment: Buffer.from(data) }]
		});
	}
}
