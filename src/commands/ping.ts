import { Message } from 'discord.js';
import { Command } from '../utils/commands';

const command: Command = {
	name: 'ping',
	run: (msg: Message) => {
		return msg.reply(`Pong!, Latency: \`${msg.client.ws.ping}\`ms`);
	}
};

export default command;
