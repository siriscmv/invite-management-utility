import { Listener } from '@sapphire/framework';
import type { Interaction } from 'discord.js';
import config from '../config.json';

export class InteractionCreateListener extends Listener {
	public async run(interaction: Interaction) {
		if (interaction.guildId !== config.mainServer) return;
		if (interaction.isButton() && interaction.customId === '_VERIFY') {
			if (Date.now() - interaction.user.createdTimestamp < 7 * 24 * 60 * 60 * 1000)
				return interaction.reply({
					content: 'Your account age is too young to get verified. Please DM a staff to get verified.',
					ephemeral: true
				});

			if (!interaction.guild!.members.cache.get(interaction.user.id)!.presence)
				return interaction.reply({
					content: 'You cannot verify while being offline! Please go online for a moment and try again.',
					ephemeral: true
				});

			await interaction.guild?.members.cache.get(interaction.user.id)!.roles.add(config.verifiedRole);
			return interaction.reply({ content: 'You are verified!', ephemeral: true });
		}
	}
}
