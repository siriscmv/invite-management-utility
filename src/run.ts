import { CommandClient, ShardClient } from 'detritus-client';
import { GatewayIntents } from 'detritus-client-socket/lib/constants';
import { readdir } from 'fs/promises';
import * as path from 'path';
import config from './config.json';

export default async () => {
	const commandClient: CommandClient = new CommandClient(process.env.DISCORD_TOKEN!, {
		useClusterClient: false,
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

	commandClient.addMultipleIn('commands');

	const events = await readdir(path.join(path.dirname(require?.main?.filename!), 'events'));

	for (const event of events) {
		if (event.endsWith('.js')) {
			const eventName = event.replace('.js', '');
			const handler = require(`./events/${eventName}`);
			commandClient.client.on(eventName, handler.default.bind(null, commandClient));
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
