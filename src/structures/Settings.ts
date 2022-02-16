import type { SapphireClient } from '@sapphire/framework';
import type { ModelStatic } from 'sequelize';
import type { DataInstance, GuildSettings } from '../../typings';
import { Collection } from 'discord.js';
import Sequelize from 'sequelize';

export interface Settings {
	client: SapphireClient;
	ready: boolean;
	raw: ModelStatic<DataInstance>;
	_guilds: Collection<string, GuildSettings>;
}

export class Settings {
	constructor(client: SapphireClient) {
		this.client = client;
		this.ready = false;
	}

	async _init() {
		const db = this.client.sequelize.define<DataInstance>('data', {
			server_id: {
				type: Sequelize.STRING,
				primaryKey: true
			},
			data: {
				type: Sequelize.TEXT
			}
		});

		this.raw = db;
		this._guilds = new Collection();
		await this.raw.sync();

		const allData = await this.raw.findAll();
		for (const d of allData) {
			if (this.client.guilds.cache.has(d.server_id) || d.server_id === '0')
				this._guilds.set(d.server_id, JSON.parse(d.data));
		}

		this.ready = true;
	}

	get(key: keyof GuildSettings, guildID = '0'): GuildSettings[typeof key] {
		return this._guilds.get(guildID)?.[key];
	}

	async delete(key: keyof GuildSettings, guildID = '0') {
		const settings = this._guilds.get(guildID);
		if (settings?.[key]) {
			delete settings[key];
			this._guilds.set(guildID, settings);
		}

		await this.raw.upsert({
			data: JSON.stringify(settings),
			server_id: guildID
		});
	}

	async refresh(guildId = '0') {
		const newData = await this.raw.findOne({ where: { server_id: guildId } });
		if (newData) this._guilds.set(newData.server_id, JSON.parse(newData.data));
	}

	async set(key: keyof GuildSettings, value: GuildSettings[keyof GuildSettings], guildID = '0') {
		if (!value) return;
		const settings = this._guilds.get(guildID) ?? {};
		(settings[key] as GuildSettings[keyof GuildSettings]) = value;

		this._guilds.set(guildID, settings);
		await this.raw.upsert({
			data: JSON.stringify(settings),
			server_id: guildID
		});
	}
}
