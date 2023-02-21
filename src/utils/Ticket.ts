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
import { ticketLogsChannel, transcriptChannel, staffRoles, red, color } from '../config.js';

export default class Ticket {
	ticketNumber: number;
	user: User;
	channel: TextChannel | null;
	reason: string;

	constructor(interaction: ModalSubmitInteraction | ButtonInteraction | null, channel?: TextChannel, author?: User) {
		let prev: number | null;
		if (interaction) {
			prev = db.get('ticketCounter') as number;
			db.set('ticketCounter', prev + 1);
		}

		this.ticketNumber = interaction ? prev! + 1 : parseInt(channel?.name?.split('-')[1] ?? '0');
		this.user = author ?? interaction!.user;
		this.channel = (channel as TextChannel) ?? null;
		this.reason = channel
			? channel.topic ?? 'none'
			: interaction!.isModalSubmit() //TODO: fix?
			? interaction.components[0].components[0].value
			: 'none';
	}

	async delete(staff: GuildMember) {
		await this.log(staff);

		const em = new EmbedBuilder()
			.setAuthor({ name: this.user.tag, iconURL: this.user.displayAvatarURL() })
			.setTitle(`Ticket ${this.ticketNumber} deleted`)
			.setDescription(`・${this.reason}\n・Closed by ${staff.user.tag}`)
			.setColor(red)
			.setFooter({ text: this.user.id })
			.setTimestamp();

		await (staff.guild.channels.cache.get(ticketLogsChannel)! as TextChannel).send({ embeds: [em] });

		staff.client.tickets.delete(this.user.id);
		return this.channel!.delete();
	}

	private async log(staff: GuildMember) {
		const msgsArray: Message[] = [];
		let first: string | undefined = undefined;
		let msgs: Message[] | null = null;

		staff.client.deleting = true;

		do {
			msgs = (await this.channel!.messages.fetch({ before: first })).map((m) => m);
			if (!msgs || msgs.length === 0) break;

			const firstMsgId: string = msgs![msgs!.length - 1]?.id;
			if (first === firstMsgId) break;

			msgsArray.push(...msgs!);
			first = firstMsgId;
		} while (true);

		const data = this.makeTranscript(this.channel!.name, this.user, this.reason, msgsArray.reverse());

		staff.client.deleting = false;

		const staffs = staff.guild.members.cache
			.filter((m) => m.roles.cache.some((r) => staffRoles.includes(r.id)))
			.map((s) => ({
				mention: s.user.toString(),
				msgs: msgsArray.filter((m) => m.author.id === s.user.id).length
			}))
			.sort((b, a) => a.msgs - b.msgs);

		const em = new EmbedBuilder()
			.setTitle(`Ticket Transcript - ${this.ticketNumber}`)
			.setColor(color)
			.setAuthor({ name: this.user.tag, iconURL: this.user.displayAvatarURL() })
			.setFooter({ text: this.user.id })
			.setTimestamp()
			.setDescription(this.reason)
			.addFields({
				name: 'Staff msgs',
				value: staffs.map((s) => `${s.mention} ・\`${s.msgs}\` messages`).join('\n')
			});

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
export const deleting = false;
