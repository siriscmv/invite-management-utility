import { Listener } from '@sapphire/framework';
import {
	ButtonInteraction,
	Interaction,
	MessageActionRow,
	Modal,
	ModalSubmitInteraction,
	OverwriteType,
	PermissionResolvable,
	TextInputComponent
} from 'discord.js';
import * as config from '../config.js';
import sleep from '../utils/sleep.js';
import { Ticket } from './../structures/Ticket';

export class InteractionCreateListener extends Listener {
	public async run(interaction: Interaction) {
		if (interaction.guildId !== config.mainServer) return;
		if (interaction.isButton() && interaction.customId === '_VERIFY') {
			if (Date.now() - interaction.user.createdTimestamp < 7 * 24 * 60 * 60 * 1000)
				return interaction.reply({
					content: 'Your account age is too young to get verified. Please DM a staff to get verified.',
					ephemeral: true
				});

			if (!interaction.guild!.members.cache.get(interaction.user.id)!.presence)
				return interaction.reply({
					content: 'You cannot verify while being offline! Please go online for a moment and try again.',
					ephemeral: true
				});

			await interaction.guild?.members.cache.get(interaction.user.id)!.roles.add(config.verifiedRole);
			return interaction.reply({ content: 'You are verified!', ephemeral: true });
		}

		if (interaction.isButton() && interaction.customId === 'NEW_TICKET') return this.askReasonForTicket(interaction);
		if (interaction.isModalSubmit() && interaction.customId === 'CREATE_TICKET') return this.createTicket(interaction);
	}

	private askReasonForTicket(interaction: ButtonInteraction) {
		if (interaction.client.tickets.has(interaction.user.id))
			return interaction.reply(
				`You have an open ticket already ${interaction.client.tickets.get(interaction.user.id).channel}`
			);

		const inputRow = new MessageActionRow<TextInputComponent>().setComponents([
			new TextInputComponent()
				.setMinLength(5)
				.setMaxLength(100)
				.setStyle('SHORT')
				.setCustomId('TICKET_REASON')
				.setRequired()
				.setLabel('Reason')
				.setPlaceholder('Enter the reason for making the ticket')
		]);
		const modal = new Modal().setCustomId('CREATE_TICKET').setTitle('Ticket Reason').addComponents(inputRow);

		return interaction.presentModal(modal);
	}

	private async createTicket(interaction: ModalSubmitInteraction) {
		await interaction.deferReply();
		const ticket = new Ticket(interaction.client, interaction);

		ticket.channel = await interaction.guild!.channels.create(`ticket-${ticket.ticketNumber}`, {
			parent: config.ticketCategory,
			type: 'GUILD_TEXT',
			topic: ticket.reason,
			permissionOverwrites: [
				...config.staffRoles.map((staff) => ({
					id: staff,
					type: 'role' as OverwriteType,
					allow: [
						'SEND_MESSAGES',
						'VIEW_CHANNEL',
						'ADD_REACTIONS',
						'EMBED_LINKS',
						'ATTACH_FILES'
					] as PermissionResolvable
				})),
				{
					id: ticket.user.id,
					type: 'member' as OverwriteType,
					allow: [
						'SEND_MESSAGES',
						'VIEW_CHANNEL',
						'ADD_REACTIONS',
						'EMBED_LINKS',
						'ATTACH_FILES',
						'MENTION_EVERYONE'
					] as PermissionResolvable
				}
			]
		});
		interaction.client.tickets.set(ticket.user.id, ticket);

		await ticket.channel.send(
			`Welcome ${ticket.user}, please ask you question here.\nMake sure to explain in detail so that our staff can help you easily`
		);

		interaction.editReply(ticket.channel.toString());

		await sleep(90 * 1000);
		const shoudlClose =
			(await ticket.channel.messages.fetch()).filter((m) => m.author.id === ticket.user.id).size === 0;

		if (!shoudlClose) return;
		return ticket.delete(interaction.guild!.me!, 'AUTO_DELETE');
	}
}
