import type { Snowflake } from 'discord.js';
import type { BayesClassifier } from 'natural';
import type { Sequelize, Model, DataTypes, Optional } from 'sequelize';
import type { Settings, KnowledgeBase, Tags } from './src/structures/Settings';
import type { Ticket } from './src/structures/Ticket';

declare module '*.json' {
	const value: any;
	export default value;
}

declare module 'discord.js' {
	export interface Client {
		db: Settings;
		knowledgeBase: KnowledgeBase;
		tags: Tags;
		sequelize: Sequelize;
		classifier: BayesClassifier;
		webhooks: Collection<'AI_SUPPORT' | 'LOGS', WebhookClient>;
		tickets: Collection<string, Ticket>;
	}
}

export interface DataAttributes {
	server_id: Snowflake;
	data: string;
}

export interface DataInstance extends Model<DataAttributes, DataAttributes>, DataAttributes {}

export interface KnowledgeBaseAttributes {
	question: string;
	answer: string;
}

export interface KnowledgeBaseInstance
	extends Model<KnowledgeBaseAttributes, KnowledgeBaseAttributes>,
		KnowledgeBaseAttributes {}

export interface TagAttributes {
	trigger: string;
	response: string;
}

export interface TagInstance extends Model<TagAttributes, TagAttributes>, TagAttributes {}

export interface Greet {
	channel_id: Snowflake;
	content: Snowflake;
	time: number;
}

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

export interface KnowledgeData {
	question: string;
	answer: string;
}
