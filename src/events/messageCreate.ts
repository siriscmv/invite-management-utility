import { CommandClient, GatewayClientEvents } from 'detritus-client';
import config from './../config.json';
import log from '../utils/log';
import sleep from '../utils/sleep';

export default async (client: CommandClient, event: GatewayClientEvents.MessageCreate) => {
	const msg = event.message;
	const inviteRegex = /(https?:\/\/)?(www\.)?(discord\.(gg|io|me|li)|discordapp\.com\/invite)\/.+[a-z]/gi;
	const urlRegex =
		/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/gi;

	if (msg.fromWebhook || msg.author.bot) return;

	if (inviteRegex.test(msg.content)) {
		if (!msg.member?.canManageMessages) {
			await msg.delete({ reason: 'Invite Link' });
			log('INVITE_LINK', msg.content, msg.author);
			const m = await msg.channel?.createMessage({
				content: `${msg.author.mention}, you can't send invite links in this channel.`
			});
			await sleep(5 * 1000);
			m?.delete();
		}
	}

	if (urlRegex.test(msg.content) && msg.content.toLowerCase().includes('nitro')) {
		if (!msg.member?.canManageMessages) {
			await msg.delete({ reason: 'Nitro Link' });
			log('SCAM_LINK', msg.content, msg.author);
		}
	}

	if (config.blacklistedWords.some((word) => msg.content.toLowerCase().includes(word))) {
		if (!msg.member?.canManageMessages) {
			await msg.delete({ reason: 'Blacklisted Word' });
			log('BLACKLISTED', msg.content, msg.author);
		}
	}
};
