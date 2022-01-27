import { SapphireClient } from '@sapphire/framework';
import '@sapphire/plugin-logger/register';
import * as sq from 'sequelize';
import { Settings } from './structures/Settings.js';
import { Collection, WebhookClient } from 'discord.js';
import { knowledgeBase } from './structures/KnowledgeBase.js';
import { Tags } from './structures/Tags.js';

const client = new SapphireClient({
	intents: ['GUILDS', 'GUILD_MESSAGES', 'GUILD_MEMBERS', 'GUILD_PRESENCES'],
	failIfNotExists: false,
	defaultPrefix: ['$']
});

const sequelize = new sq.Sequelize({
	dialect: 'sqlite',
	storage: 'database.sqlite',
	logging: false
});

client.sequelize = sequelize;
client.db = new Settings(client);
client.knowledgeBase = new knowledgeBase(client);
client.tags = new Tags(client);

client.webhooks = new Collection();
client.webhooks.set('AI_SUPPORT', new WebhookClient({ url: process.env.AI_SUPPORT! }));

client.login(process.env.DISCORD_TOKEN!);
