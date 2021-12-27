import { CommandClient } from 'detritus-client';
import { InteractionDataApplicationCommand } from 'detritus-client/lib/structures';
import config from './config.json';

const commandClient = new CommandClient(process.env.DISCORD_TOKEN!, {
	prefixes: ['-']
});

commandClient.add({
	name: 'ping',
	run: async (context, args) => {
		const { gateway, rest } = await context.client.ping();
		return context.reply(`Pong!\nGateway: \`${gateway}\`ms\nRest: \`${rest}\`ms`);
	}
});

(async () => {
	const client = await commandClient.run();
	client.on('interactionCreate', async (event) => {
		const interaction = event.interaction;
		if (interaction.guildId != config.mainServer) return;
		if (interaction.data instanceof InteractionDataApplicationCommand) return;

		if (interaction.data?.customId != '_verify') return;

		if (Date.now() - interaction.user.createdAtUnix < 7 * 24 * 60 * 60 * 1000) {
			interaction.reply('Your account age is too young to get verified. Please DM a staff to get verified.');
		} else if (interaction.member?.presence?.isOffline) {
			interaction.reply('You are offline. Please go online and try again.');
		} else {
			await interaction.member?.addRole(config.verifiedRole);
			interaction.reply('You are verified!');
		}
	});
	console.log(`Client has logged in as ${client.applicationId}`);
})();
