import { CommandClient, ShardClient } from 'detritus-client';
import { GatewayIntents } from 'detritus-client-socket/lib/constants';
import { readdir } from 'fs/promises';
import config from './config.json';

export default async () => {
	const commandClient = new CommandClient(process.env.DISCORD_TOKEN!, {
		gateway: {
			loadAllMembers: true,
			intents: [
				GatewayIntents.GUILDS,
				GatewayIntents.GUILD_MEMBERS,
				GatewayIntents.GUILD_MESSAGES,
				GatewayIntents.GUILD_PRESENCES
			]
		},
		prefixes: config.prefixes
	});

	commandClient.addMultipleIn('./commands/');

	const events = await readdir('./events/');

	for (const event of events) {
		if (event.endsWith('.ts')) {
			const eventName = event.replace('.ts', '');
			const eventModule = await import(`./events/${event}`);
			const handler = eventModule.default;
			commandClient.on(eventName, (...args) => handler(commandClient, ...args));
		}
	}

	const _commandClient = await commandClient.run();
	console.log(`Client has logged in as ${_commandClient.applicationId}`);
	if (_commandClient instanceof ShardClient) {
		await _commandClient.guilds.cache.get(config.mainServer)?.requestMembers({
			presences: true,
			query: ''
		});
		console.log(`Chunked members!`);
	}
};
