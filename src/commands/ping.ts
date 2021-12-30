import { Context } from 'detritus-client/lib/command';

const pingCommand: Command = {
	name: 'ping',
	run: async (context: Context) => {
		const ping = await context.client.ping();
		return context.reply(`Pong!\nGateway: \`${ping.gateway}\` ms\nRest: \`${ping.rest}\` ms`);
	}
};

export default pingCommand;
