import { MessageReaction, User } from 'discord.js';
import { mainServer, rolesMenu } from '../config.js';

export default async function run(reaction: MessageReaction, user: User) {
	if (reaction.partial) await reaction.fetch().catch(() => {});
	if (reaction.message?.guild?.id !== mainServer) return;
	if (reaction.message?.id !== rolesMenu.message) return;
	if (!reaction.emoji?.name) return;

	const member = reaction.message.guild!.members.cache.get(user.id)!;
	//@ts-ignore
	const roleId = rolesMenu.roles[reaction.emoji.name];
	if (!roleId) return;

	const role = reaction.message.guild!.roles.cache.get(roleId)!;

	await member.roles.remove(role).catch(() => null);
}
