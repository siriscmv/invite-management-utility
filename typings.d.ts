import type { Snowflake } from 'discord.js';
import type { Sequelize, Model, DataTypes, Optional } from 'sequelize';
import type { Settings, KnowledgeBase, Tags } from './src/structures/Settings';
import type { Ticket } from './src/utils/Ticket';

declare module '*.json' {
	const value: any;
	export default value;
}
