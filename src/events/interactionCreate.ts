import {
	ButtonInteraction,
	Interaction,
	ActionRowBuilder,
	EmbedBuilder,
	ModalSubmitInteraction,
	OverwriteType,
	TextInputBuilder,
	TextInputStyle,
	ModalBuilder,
	TextChannel,
	ChannelType,
	PermissionFlagsBits
} from 'discord.js';
import * as config from '../config.js';
import sleep from '../utils/sleep.js';
import Ticket, { tickets } from '../utils/Ticket.js';

export default async function run(interaction: Interaction) {
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

	if (interaction.isButton() && interaction.customId === 'NEW_TICKET') return askReasonForTicket(interaction);
	if (interaction.isModalSubmit() && interaction.customId === 'CREATE_TICKET') return createTicket(interaction);
}

const askReasonForTicket = (interaction: ButtonInteraction) => {
	if (tickets.has(interaction.user.id))
		return interaction.reply({
			content: `You have an open ticket already ${tickets.get(interaction.user.id)!.channel}`,
			ephemeral: true
		});

	const inputRow = new ActionRowBuilder<TextInputBuilder>().setComponents([
		new TextInputBuilder()
			.setMinLength(5)
			.setMaxLength(30)
			.setStyle(TextInputStyle.Short)
			.setCustomId('TICKET_REASON')
			.setRequired()
			.setLabel('Reason')
			.setPlaceholder('Enter the reason for making the ticket')
	]);

	const modal = new ModalBuilder().setCustomId('CREATE_TICKET').setTitle('Ticket Reason').addComponents(inputRow);

	return interaction.showModal(modal);
};

const createTicket = async (interaction: ModalSubmitInteraction | ButtonInteraction) => {
	const ticket = await Ticket.fromInteraction(interaction);

	ticket.channel = (await interaction.guild!.channels.create({
		name: `ticket-${ticket.ticketNumber}`,
		parent: config.ticketCategory,
		type: ChannelType.GuildText,
		topic: ticket.reason,
		permissionOverwrites: [
			...config.staffRoles.map((staff) => ({
				id: staff,
				type: OverwriteType.Role,
				allow: [
					PermissionFlagsBits.SendMessages,
					PermissionFlagsBits.ViewChannel,
					PermissionFlagsBits.AddReactions,
					PermissionFlagsBits.EmbedLinks,
					PermissionFlagsBits.AttachFiles
				]
			})),
			{
				id: ticket.user.id,
				type: OverwriteType.Member,
				allow: [
					PermissionFlagsBits.SendMessages,
					PermissionFlagsBits.ViewChannel,
					PermissionFlagsBits.EmbedLinks,
					PermissionFlagsBits.AttachFiles
				]
			},
			{
				id: interaction.guild!.id,
				type: OverwriteType.Role,
				deny: [PermissionFlagsBits.SendMessages, PermissionFlagsBits.ViewChannel]
			}
		]
	})) as TextChannel;
	tickets.set(ticket.user.id, ticket);

	ticket.channel.send(
		`Welcome ${ticket.user}, please ask you question here.\nMake sure to explain in detail so that our <@&893483433538510898> staff can help you easily.\nThis ticket will be deleted automatically if you do not respond`
	);

	interaction.reply({
		content: ticket.channel.toString(),
		ephemeral: true
	});

	const em = new EmbedBuilder()
		.setAuthor({ name: ticket.user.tag, iconURL: ticket.user.displayAvatarURL() })
		.setThumbnail(ticket.user.displayAvatarURL())
		.setTitle(`Ticket Opened - ${ticket.ticketNumber}`)
		.setColor(config.green)
		.setFields(
			{
				name: 'User',
				value: ticket.user.toString(),
				inline: true
			},
			{
				name: 'Reason',
				value: ticket.reason,
				inline: true
			}
		)
		.setTimestamp();

	await (interaction.guild!.channels.cache.get(config.ticketLogsChannel)! as TextChannel).send({
		embeds: [em]
	});

	await sleep(5 * 60 * 1000);
	const shoudlClose = (await ticket.channel.messages.fetch()).filter((m) => m.author.id === ticket.user.id).size === 0;

	if (!shoudlClose) return;
	ticket.user
		.send(
			'Your ticket was automatically deleted because you did not send a message within 5 minutes of making the ticket. If you need help, please open a new ticket.'
		)
		.catch(() => {});
	return ticket.delete(interaction.guild!.members.me!, 'User did not respond');
};
