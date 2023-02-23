import { Collection, Message } from 'discord.js';
import { readdir } from 'fs/promises';

export interface Command {
	name: string;
	shouldRun?: (msg: Message) => string | boolean;
	run: (msg: Message) => Promise<unknown>;
	aliases?: string[];
}

export const loadCommands = async () => {
	const commandNames = await readdir('./../commands');
	for (const commandName of commandNames) {
		const { default: command } = await import(`./../commands/${commandName}`);
		if (!command || !command.name || !command.run) continue;
		commands.set(command.name, command);
	}
};

const commands = new Collection<string, Command>();
export default commands;
