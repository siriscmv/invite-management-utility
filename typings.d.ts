import type { Snowflake } from 'discord.js';
import type { BayesClassifier } from 'natural';
import type { Sequelize, Model, DataTypes, Optional } from 'sequelize';
import type { Settings } from './src/structures/Settings';

declare module '*.json' {
	const value: any;
	export default value;
}

declare module 'discord.js' {
	export interface Client {
		db: Settings;
		sequelize: Sequelize;
		classifier: BayesClassifier;
		webhooks: Collection<'AI_SUPPORT' | 'LOGS', WebhookClient>;
	}
}

export interface DataAttributes {
	server_id: Snowflake;
	data: string;
}

export interface DataInstance extends Model<DataAttributes, DataAttributes>, DataAttributes {}

export interface Greet {
	channel_id: Snowflake;
	content: Snowflake;
	time: number;
}

export interface GuildSettings {
	greet?: Greet[];
	autoKickBypass?: Snowflake[];
	altAge?: number;
}
