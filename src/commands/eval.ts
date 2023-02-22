import { Message, EmbedBuilder } from 'discord.js';
import { owners } from 'src/config';
import { Command } from '../utils/commands';
import { inspect } from 'util';

const command: Command = {
	name: 'eval',
	shouldRun: (msg: Message) => owners.includes(msg.author.id),
	run: async (msg: Message) => {
		/*
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
		*/
	}
};

export default command;

const evalCode = async (ctx: Message, code: string, flags: { async: boolean; depth: number; showHidden: boolean }) => {
	if (flags.async) code = `(async () => {\n${code}\n})();`;

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const msg = ctx;

	let success = true;
	let result = null;

	try {
		// eslint-disable-next-line no-eval
		result = eval(code);
	} catch (error) {
		if (error && error instanceof Error && error.stack) {
			console.error(error);
		}
		result = error;
		success = false;
	}

	result = await (await result).toString();

	if (typeof result !== 'string') {
		result = inspect(result, {
			depth: flags.depth,
			showHidden: flags.showHidden
		});
	}

	return { result, success };
};
