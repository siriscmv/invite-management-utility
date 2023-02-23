import {
	ButtonInteraction,
	GuildMember,
	EmbedBuilder,
	ModalSubmitInteraction,
	User,
	TextChannel,
	Collection
} from 'discord.js';
import { ticketLogsChannel, transcriptChannel, red, color } from '../config.js';
import prisma from '../utils/prisma.js';
import { createTranscript } from 'discord-html-transcripts';

export default class Ticket {
	ticketNumber: number;
	user: User;
	channel: TextChannel | null;
	reason: string;

	constructor(ticketNumber: number, user: User, channel: TextChannel | null, reason: string) {
		this.ticketNumber = ticketNumber;
		this.user = user;
		this.channel = channel;
		this.reason = reason;
	}

	static async fromInteraction(interaction: ModalSubmitInteraction | ButtonInteraction) {
		const ticketCounter = parseInt((await prisma.kv.findUnique({ where: { key: 'ticket_counter' } }))!.value);
		await prisma.kv.update({ where: { key: 'ticket_counter' }, data: { value: (ticketCounter + 1).toString() } });

		//@ts-ignore
		return new Ticket(ticketCounter + 1, interaction.user, null, interaction.components[0].components[0].value);
	}

	async delete(staff: GuildMember, note?: string) {
		await this.log(staff);

		const em = new EmbedBuilder()
			.setAuthor({ name: this.user.tag, iconURL: this.user.displayAvatarURL() })
			.setTitle(`Ticket ${this.ticketNumber} deleted`)
			.setDescription(
				`・Ticket made by ${this.user}\n・Reason: ${this.reason}\n・Closed by \`${staff.user.tag}\`${
					note ? `\n・${note}` : ''
				}`
			)
			.setColor(red)
			.setFooter({ text: this.user.id })
			.setTimestamp();

		await (staff.guild.channels.cache.get(ticketLogsChannel)! as TextChannel).send({ embeds: [em] });

		tickets.delete(this.user.id);
		this.channel!.messages.cache.clear();
		return this.channel!.delete();
	}

	private async log(staff: GuildMember) {
		deleting = true;

		const transcript = await createTranscript(this.channel!, {
			poweredBy: false
		});

		deleting = false;

		const em = new EmbedBuilder()
			.setTitle(`Ticket Transcript - ${this.ticketNumber}`)
			.setColor(color)
			.setAuthor({ name: this.user.tag, iconURL: this.user.displayAvatarURL() })
			.setFooter({ text: this.user.id })
			.setTimestamp()
			.setDescription(
				`・Ticket made by ${this.user}\n・Reason: ${this.reason}\n・Closed by \`${
					staff.user.tag
				}\`\n・Total Messages: ${this.channel!.messages.cache.size}`
			);

		return await (staff.client.channels.cache.get(transcriptChannel) as TextChannel).send({
			embeds: [em],
			files: [transcript]
		});
	}
}

export const tickets = new Collection<string, Ticket>();
let deleting = false;
export const isDeleting = () => deleting;
