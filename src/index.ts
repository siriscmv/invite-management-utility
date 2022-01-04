import { SapphireClient } from '@sapphire/framework';
import '@sapphire/plugin-logger/register';

const client = new SapphireClient({
	intents: ['GUILDS', 'GUILD_MESSAGES', 'GUILD_MEMBERS', 'GUILD_PRESENCES'],
	failIfNotExists: false,
	defaultPrefix: ['$']
});

client.login(process.env.DISCORD_TOKEN!);
