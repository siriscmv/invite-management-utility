import type { SapphireClient } from '@sapphire/framework';
import type { ModelStatic } from 'sequelize/dist';
import type { TagInstance } from '../../typings';
import { Collection } from 'discord.js';
import Sequelize from 'sequelize';

export class Tags {
	client: SapphireClient<boolean>;
	ready: boolean;
	raw!: ModelStatic<TagInstance>;
	data!: Collection<string, string>;
	public prefix: string;

	constructor(client: SapphireClient) {
		this.client = client;
		this.ready = false;
		this.prefix = '?';
	}

	async _init() {
		const db = this.client.sequelize.define<TagInstance>('tags', {
			trigger: {
				type: Sequelize.TEXT,
				primaryKey: true
			},
			response: {
				type: Sequelize.TEXT
			}
		});

		this.raw = db;
		this.data = new Collection();
		await this.raw.sync();

		const allData = await this.raw.findAll();
		for (const d of allData) {
			this.data.set(d.trigger, d.response);
		}

		this.ready = true;
	}

	get(key: string) {
		const data = this.data.get(key);
		if (!data) return;
		return data;
	}

	async delete(key: string) {
		const d = this.data.get(key);
		if (!d) return;
		this.data.delete(key);

		await this.raw.destroy({
			where: { trigger: key }
		});
	}

	async set(key: string, value: string) {
		if (!value) return;

		this.data.set(key, value);
		await this.raw.upsert({
			trigger: key,
			response: value
		});
	}
}
