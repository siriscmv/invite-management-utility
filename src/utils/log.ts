import { User } from 'detritus-client/lib/structures';
import { Embed } from 'detritus-client/lib/utils';
import config from './../config.json';

const types = {
	INVITE_LINK: 'Invite Link deleted',
	SCAM_LINK: 'Scam nitro link deleted',
	BLACKLISTED: 'Blacklisted substring deleted'
};

export default async (type: keyof typeof types, content: string, user: User) => {
	const embed = new Embed()
		.setColor(16711680)
		.setTitle(types[type] ?? 'Unknown')
		.setDescription(content)
		.setAuthor(user.tag, user.avatarUrlFormat('png'));

	user.client.channels.get(config.logs)?.createMessage({ embed });
};
