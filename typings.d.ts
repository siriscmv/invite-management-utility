import type { Snowflake } from 'discord.js';
import type { Sequelize, Model, DataTypes, Optional } from 'sequelize';
import type { Settings, KnowledgeBase, Tags } from './src/structures/Settings';
import type { Ticket } from './src/utils/Ticket';

declare module '*.json' {
	const value: any;
	export default value;
}

declare module 'discord.js' {
	export interface Client {
		db: Settings;
		tags: Tags;
		sequelize: Sequelize;
		classifier: BayesClassifier;
		webhooks: Collection<'AI_SUPPORT' | 'LOGS', WebhookClient>;
		tickets: Collection<string, Ticket>;
		deleting: boolean;
	}
}

export interface DataAttributes {
	server_id: Snowflake;
	data: string;
}

export interface DataInstance extends Model<DataAttributes, DataAttributes>, DataAttributes {}

export interface TagAttributes {
	trigger: string;
	response: string;
}

export interface TagInstance extends Model<TagAttributes, TagAttributes>, TagAttributes {}

export interface GuildSettings {
	greet?: Greet[];
	autoKickBypass?: Snowflake[];
	altAge?: number;
	ticketCounter?: number;
}

export interface TagData {
	trigger: string;
	response: string;
}
