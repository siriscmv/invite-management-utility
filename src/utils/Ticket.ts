import {
	ButtonInteraction,
	GuildMember,
	Message,
	EmbedBuilder,
	ModalSubmitInteraction,
	User,
	TextChannel,
	Collection
} from 'discord.js';
import { ticketLogsChannel, transcriptChannel, red, color } from '../config.js';
import prisma from '../utils/prisma.js';

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
		return this.channel!.delete();
	}

	private async log(staff: GuildMember) {
		const msgsArray: Message[] = [];
		let first: string | undefined = undefined;
		let msgs: Message[] | null = null;

		deleting = true;

		do {
			msgs = (await this.channel!.messages.fetch({ before: first })).map((m) => m);
			if (!msgs || msgs.length === 0) break;

			const firstMsgId: string = msgs![msgs!.length - 1]?.id;
			if (first === firstMsgId) break;

			msgsArray.push(...msgs!);
			first = firstMsgId;
		} while (true);

		const data = this.makeTranscript(this.channel!.name, this.user, this.reason, msgsArray.reverse());

		deleting = false;

		const em = new EmbedBuilder()
			.setTitle(`Ticket Transcript - ${this.ticketNumber}`)
			.setColor(color)
			.setAuthor({ name: this.user.tag, iconURL: this.user.displayAvatarURL() })
			.setFooter({ text: this.user.id })
			.setTimestamp()
			.setDescription(`・Ticket made by ${this.user}\n・Reason: ${this.reason}\n・Closed by \`${staff.user.tag}\``);

		return await (staff.client.channels.cache.get(transcriptChannel) as TextChannel).send({
			embeds: [em],
			files: [{ name: `ticket-${this.ticketNumber}.html`, attachment: Buffer.from(data) }]
		});
	}

	private makeTranscript(channelName: string, author: User, reason: string, messages: Message[]) {
		return `${channelName}\nAuthor・${author.tag} (${author.id})\nReason・${reason}\nMessages・${
			messages.length
		}\nCreated・${messages[0].createdAt.toLocaleString('en-IN', { timeZone: 'IST' })}\nDeleted・${new Date(
			Date.now()
		).toLocaleString('en-IN', { timeZone: 'IST' })}\n\nMessages:\n\n${messages
			.map(
				(m) =>
					`${m.author.tag} (${m.author.id}) | ${m.createdAt.toLocaleString('en-ID', { timeZone: 'IST' })} | ${
						m.content
					}`
			)
			.join('\n')}
		`;
	}
}

export const tickets = new Collection<string, Ticket>();
let deleting = false;
export const isDeleting = () => deleting;
