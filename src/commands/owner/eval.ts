import { Args, Command } from '@sapphire/framework';
import { Type } from '@sapphire/type';
import { codeBlock, isThenable } from '@sapphire/utilities';
import type { CommandInteraction, Message } from 'discord.js';
import { inspect } from 'util';
import { emotes } from '../../utils/emotes';

export class EvalCommand extends Command {
	public constructor(context: Command.Context, options: Command.Options) {
		super(context, {
			...options,
			name: 'eval',
			description: 'Evals any JavaScript code',
			quotes: [],
			preconditions: ['OwnerOnly'],
			flags: ['async', 'hidden', 'showHidden', 'silent', 's'],
			options: ['depth']
		});
	}
	public async messageRun(message: Message, args: Args) {
		const code = await args.rest('codeblock').catch(async () => await args.rest('string'));

		const { result, success, type } = await this.eval(message, code, {
			async: args.getFlags('async'),
			depth: Number(args.getOption('depth')) ?? 0,
			showHidden: args.getFlags('hidden', 'showHidden')
		});

		const output = success ? codeBlock('js', result) : `**ERROR**: ${codeBlock('bash', result)}`;
		if (args.getFlags('silent', 's')) {
			if (success) message.react(emotes.yes);
			else message.react(emotes.no);
			return null;
		}

		const typeFooter = `**Type**: ${codeBlock('typescript', type)}`;

		if (output.length > 2000) {
			return message.reply({
				content: `Output was too long... sent the result as a file.\n\n${typeFooter}`,
				files: [{ attachment: Buffer.from(output), name: 'output.js' }]
			});
		}

		return message.reply(`${output}\n${typeFooter}`);
	}

	public async chatInputRun(interaction: CommandInteraction) {
		const code = interaction.options.getString('code')!;

		const { result, success, type } = await this.eval(interaction, code, {
			async: interaction.options.getBoolean('async') ?? false,
			depth: interaction.options.getInteger('depth') ?? 0,
			showHidden: interaction.options.getBoolean('showHidden') ?? false
		});

		const output = success ? codeBlock('js', result) : `**ERROR**: ${codeBlock('bash', result)}`;

		const typeFooter = `**Type**: ${codeBlock('typescript', type)}`;

		if (output.length > 2000) {
			return interaction.reply({
				content: `Output was too long... sent the result as a file.\n\n${typeFooter}`,
				files: [{ attachment: Buffer.from(output), name: 'output.js' }],
				ephemeral: interaction.options.getBoolean('hidden') ?? false
			});
		}

		return interaction.reply({
			content: `${output}\n${typeFooter}`,
			ephemeral: interaction.options.getBoolean('hidden') ?? false
		});
	}
	
	private async eval(ctx: Message | CommandInteraction, code: string, flags: { async: boolean; depth: number; showHidden: boolean }) {
		if (flags.async) code = `(async () => {\n${code}\n})();`;

		// @ts-expect-error value is never read, this is so `msg` is possible as an alias when sending the eval.
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const msg = ctx; const interaction = ctx; 
		
		let success = true;
		let result = null;

		try {
			// eslint-disable-next-line no-eval
			result = eval(code);
		} catch (error) {
			if (error && error instanceof Error && error.stack) {
				this.container.client.logger.error(error);
			}
			result = error;
			success = false;
		}

		const type = new Type(result).toString();
		if (isThenable(result)) result = await result;

		if (typeof result !== 'string') {
			result = inspect(result, {
				depth: flags.depth,
				showHidden: flags.showHidden
			});
		}

		return { result, success, type };
	}
}
