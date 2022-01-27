import { SapphireClient } from '@sapphire/framework';
import '@sapphire/plugin-logger/register';
import * as sq from 'sequelize';
import { Settings } from './structures/Settings.js';
import natural from 'natural';
import train from './utils/train.js';
import { Collection, WebhookClient } from 'discord.js';

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

client.classifier = new natural.LogisticRegressionClassifier();
train(client.classifier);

client.webhooks = new Collection();
client.webhooks.set('AI_SUPPORT', new WebhookClient({ url: process.env.AI_SUPPORT! }));

client.login(process.env.DISCORD_TOKEN!);
