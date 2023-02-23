import { Message } from 'discord.js';
import { owners } from 'src/config.js';
import { Command } from '../utils/commands.js';
import { inspect } from 'util';

const command: Command = {
	name: 'eval',
	shouldRun: (msg: Message) => owners.includes(msg.author.id),
	run: async (msg: Message) => {
		const code = msg.content.split(' ').slice(1).join(' ');

		const { result, success } = await evalCode(msg, code, {
			async: code.includes('await'),
			depth: 2
		});

		const output = success ? `\`\`\`js\n${result}\`\`\`` : `**ERROR**: \`\`\`bash\n${result}\`\`\``;
		if (output.length > 2000) {
			return msg.reply({
				content: `Output was too long... sent the result as a file`,
				files: [{ attachment: Buffer.from(result), name: 'output.js' }]
			});
		}

		return msg.reply(output);
	}
};

export default command;

const evalCode = async (ctx: Message, code: string, flags: { async: boolean; depth: number }) => {
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
			depth: flags.depth
		});
	}

	return { result, success };
};
