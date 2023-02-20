import type { SapphireClient } from '@sapphire/framework';
import {
	BaseGuildTextChannel,
	ButtonInteraction,
	GuildMember,
	GuildTextBasedChannel,
	Message,
	MessageEmbed,
	ModalSubmitInteraction,
	User
} from 'discord.js';
import { ticketLogsChannel, transcriptChannel, staffRoles, dot, red } from '../config.js';

export class Ticket {
	ticketNumber: number;
	user: User;
	channel: GuildTextBasedChannel | null;
	reason: string;

	constructor(
		client: SapphireClient,
		interaction: ModalSubmitInteraction | ButtonInteraction | null,
		channel?: BaseGuildTextChannel,
		author?: User
	) {
		let prev: number | null;
		if (interaction) {
			prev = client.db.get('ticketCounter') as number;
			client.db.set('ticketCounter', prev + 1);
		}

		this.ticketNumber = interaction ? prev! + 1 : parseInt(channel?.name?.split('-')[1] ?? '0');
		this.user = author ?? interaction!.user;
		this.channel = (channel as GuildTextBasedChannel) ?? null;
		this.reason = channel
			? channel.topic ?? 'none'
			: interaction!.isModalSubmit()
			? interaction.components[0].components[0].value
			: 'none';
	}

	async delete(staff: GuildMember) {
		await this.log(staff);

		const em = new MessageEmbed()
			.setAuthor({ name: this.user.tag, iconURL: this.user.displayAvatarURL({ dynamic: true }) })
			.setTitle(`Ticket ${this.ticketNumber} deleted`)
			.setDescription(this.reason)
			.setColor(red)
			.setFooter({ text: staff.user.tag, iconURL: staff.user.displayAvatarURL({ dynamic: true }) })
			.setTimestamp();

		await (staff.guild.channels.cache.get(ticketLogsChannel)! as GuildTextBasedChannel).send({ embeds: [em] });

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

		//const data = await transcript(staff.client, this.ticketNumber, this.channel!.name, msgsArray.reverse());
		const data = this.makeTranscript(this.channel!.name, this.user, this.reason, msgsArray.reverse());

		staff.client.deleting = false;

		const staffs = staff.guild.members.cache
			.filter((m) => m.roles.cache.some((r) => staffRoles.includes(r.id)))
			.map((s) => ({
				mention: s.user.toString(),
				msgs: msgsArray.filter((m) => m.author.id === s.user.id).length
			}))
			.sort((b, a) => a.msgs - b.msgs);

		const em = new MessageEmbed()
			.setTitle(`Ticket transcript - ${this.ticketNumber}`)
			.setColor('BLUE')
			.setAuthor({ name: this.user.tag, iconURL: this.user.displayAvatarURL({ dynamic: true }) })
			.setTimestamp()
			.setDescription(this.reason)
			.addField('Staff msgs', staffs.map((s) => `${s.mention} ${dot} \`${s.msgs}\` messages`).join('\n'));

		return await (staff.client.channels.cache.get(transcriptChannel) as GuildTextBasedChannel).send({
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
