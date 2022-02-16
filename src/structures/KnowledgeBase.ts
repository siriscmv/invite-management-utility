import type { SapphireClient } from '@sapphire/framework';
import type { ModelStatic } from 'sequelize';
import type { KnowledgeBaseInstance } from '../../typings';
import { Collection } from 'discord.js';
import Sequelize from 'sequelize';
import natural from 'natural';

export class knowledgeBase {
	client: SapphireClient<boolean>;
	ready: boolean;
	raw!: ModelStatic<KnowledgeBaseInstance>;
	data!: Collection<string, string>;
	constructor(client: SapphireClient) {
		this.client = client;
		this.ready = false;
	}

	async _init() {
		const db = this.client.sequelize.define<KnowledgeBaseInstance>('knowledgeBase', {
			question: {
				type: Sequelize.TEXT,
				primaryKey: true
			},
			answer: {
				type: Sequelize.TEXT
			}
		});

		this.raw = db;
		this.data = new Collection();
		await this.raw.sync();

		const allData = await this.raw.findAll();
		this.client.classifier = new natural.LogisticRegressionClassifier();

		for (const d of allData) {
			this.data.set(d.question, d.answer);
			this.client.classifier.addDocument(d.question, d.answer);
		}

		this.client.classifier.train();
		this.ready = true;
	}

	get(key: string) {
		return this.data.get(key);
	}

	async delete(key: string) {
		const d = this.data.get(key);
		if (!d) return;
		this.data.delete(key);

		await this.raw.destroy({
			where: { question: key }
		});

		await this.train();
	}

	async set(key: string, value: string) {
		if (!value) return;

		this.data.set(key, value);
		await this.raw.upsert({
			question: key,
			answer: value
		});

		await this.train();
	}

	private async train() {
		const data = await this.raw.findAll();
		this.client.classifier = new natural.LogisticRegressionClassifier();
		for (const d of data) {
			this.client.classifier.addDocument(d.question, d.answer);
		}
		return this.client.classifier.train();
	}
}
