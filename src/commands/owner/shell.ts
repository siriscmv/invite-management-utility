import { Args, Command } from '@sapphire/framework';
import { codeBlock } from '@sapphire/utilities';
import type { ExecException } from 'child_process';
import type { Message } from 'discord.js';
import { inspect, promisify } from 'util';
import { emotes } from '../../utils/emotes.js';
const exec = promisify(require('child_process').exec);

export class ShellCommand extends Command {
	public constructor(context: Command.Context, options: Command.Options) {
		super(context, {
			...options,
			name: 'shell',
			aliases: ['exec'],
			description: 'Execute bash script',
			quotes: [],
			preconditions: ['OwnerOnly'],
			flags: ['silent', 's']
		});
	}
	public async messageRun(message: Message, args: Args) {
		const code = await args.rest('string');

		const { stdout, stderr } = await exec(code).catch((e: ExecException) => ({ stdout: '', stderr: inspect(e) }));

		const output = stderr ? `**ERROR**: ${codeBlock('bash', stderr)}` : codeBlock('bash', stdout || 'Done');
		if (args.getFlags('silent', 's')) {
			if (stderr) message.react(emotes.no);
			else message.react(emotes.yes);
			return null;
		}

		if (output.length > 2000) {
			return message.reply({
				content: `Output was too long... sent the result as a file`,
				files: [{ attachment: Buffer.from(output), name: 'output.js' }]
			});
		}

		return message.reply(`${output}`);
	}
}
