import { SapphireClient } from '@sapphire/framework';
import '@sapphire/plugin-logger/register';
import * as sq from 'sequelize';

const client = new SapphireClient({
	intents: ['GUILDS', 'GUILD_MESSAGES', 'GUILD_MEMBERS', 'GUILD_PRESENCES'],
	failIfNotExists: false,
	defaultPrefix: ['$']
});

const sequelize = new sq.Sequelize({
	dialect: 'sqlite',
	storage: '../database.sqlite'
});

client.sequelize = sequelize;

client.login(process.env.DISCORD_TOKEN!);
