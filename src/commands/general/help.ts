import { Args, Command, CommandStore } from '@sapphire/framework';
import { ColorResolvable, Message, MessageEmbed } from 'discord.js';
import * as config from '../../config.js';
const { container } = require('@sapphire/framework');

export class HelpCommand extends Command {
	public constructor(context: Command.Context, options: Command.Options) {
		super(context, {
			...options,
			name: 'help',
			description: "Get a list of the bot's commands"
		});
	}

	public async messageRun(msg: Message, args: Args) {
		const command = await args.pick('command').catch(() => null);

		if (command) {
			const embed = new MessageEmbed()
				.setColor(config.color as ColorResolvable)
				.setTitle(`${this.capitalise(command.name)} Command`)
				.setAuthor({
					name: msg.client.user!.tag,
					iconURL: msg.client.user!.displayAvatarURL()
				})
				.setDescription(command.description)
				.addField('Aliases', command.aliases.join(', '), true)
				.addField('Category', command.fullCategory[0], true)
				.addField(
					'Flags, Options',
					`Flags: ${
						(command.options.flags as string[] | undefined)?.map((d) => `\`--${d}\``).join(', ') ?? 'None'
					}\nOptions: ${
						(command.options.options as string[] | undefined)?.map((d) => `\`--${d}=\``).join(',') ?? 'None'
					}`,
					false
				);

			return msg.reply({ embeds: [embed] });
		}

		const commands: CommandStore = container.stores.get('commands');
		const categories = [...new Set(commands.map((c) => c.fullCategory[0]))];

		const embed = new MessageEmbed()
			.setTitle('All commands')
			.setAuthor({
				name: msg.client.user!.tag,
				iconURL: msg.client.user!.displayAvatarURL()
			})
			.setColor(config.color as ColorResolvable)
			.addFields(
				categories.map((cat) => {
					return {
						name: this.capitalise(cat),
						value: commands
							.filter((c) => cat === c.fullCategory[0])
							.map((c) => this.capitalise(c.name))
							.join('\n'),
						inline: true
					};
				})
			);

		return msg.reply({ embeds: [embed] });
	}

	private capitalise(str: string) {
		return str.charAt(0).toUpperCase() + str.slice(1);
	}
}
