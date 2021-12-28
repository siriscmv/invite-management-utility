import { ShardClient } from 'detritus-client';
import { GatewayIntents } from 'detritus-client-socket/lib/constants';
import { InteractionCallbackTypes, MessageFlags } from 'detritus-client/lib/constants';
import { InteractionDataApplicationCommand } from 'detritus-client/lib/structures';
import config from './config.json';

const shardClient = new ShardClient(process.env.DISCORD_TOKEN!, {
	gateway: {
		loadAllMembers: true,
		intents: [
			GatewayIntents.GUILDS,
			GatewayIntents.GUILD_MEMBERS,
			GatewayIntents.GUILD_MESSAGES,
			GatewayIntents.GUILD_PRESENCES
		]
	}
});

shardClient.on('interactionCreate', async (event) => {
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
});

(async () => {
	const client = await shardClient.run();
	console.log(`Client has logged in as ${client.applicationId}`);
	await client.guilds.cache.get(config.mainServer)?.requestMembers({
		presences: true,
		query: ''
	});
	console.log(`Chunked members!`);
})();
