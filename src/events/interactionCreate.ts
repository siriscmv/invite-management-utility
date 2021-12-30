import { CommandClient, GatewayClientEvents } from 'detritus-client';
import { InteractionCallbackTypes, MessageFlags } from 'detritus-client/lib/constants';
import { InteractionDataApplicationCommand } from 'detritus-client/lib/structures';
import config from './../config.json';

export default async (commandClient: CommandClient, event: GatewayClientEvents.InteractionCreate) => {
	const interaction = event.interaction;
	if (interaction.guildId != config.mainServer) return;
	if (interaction.data instanceof InteractionDataApplicationCommand) return;

	if (interaction.data?.customId != '_VERIFY') return;

	if (Date.now() - interaction.user.createdAtUnix < 7 * 24 * 60 * 60 * 1000) {
		await interaction.respond(InteractionCallbackTypes.CHANNEL_MESSAGE_WITH_SOURCE, {
			content: 'Your account age is too young to get verified. Please DM a staff to get verified.',
			flags: MessageFlags.EPHEMERAL
		});
	} else if (!interaction.guild?.members.get(interaction.userId)?.presence) {
		await interaction.respond(InteractionCallbackTypes.CHANNEL_MESSAGE_WITH_SOURCE, {
			content: 'You cannot verify while being offline!',
			flags: MessageFlags.EPHEMERAL
		});
	} else {
		await interaction.respond(InteractionCallbackTypes.CHANNEL_MESSAGE_WITH_SOURCE, {
			content: 'You are verified!',
			flags: MessageFlags.EPHEMERAL
		});
		await interaction.member?.addRole(config.verifiedRole);
	}
};
