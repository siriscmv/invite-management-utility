import { User } from 'discord.js';
import { decancer, dehoist } from './guildMemberAdd.js';
import { mainServer } from 'src/config.js';

export default async function run(oldUser: User, newUser: User) {
	if (oldUser.username === newUser.username) return;

	const name = newUser.username;
	const normalized = dehoist(decancer(name));
	if (normalized !== name) {
		await newUser.client.guilds.cache.get(mainServer)!.members.cache.get(newUser.id)?.setNickname(normalized);
	}
}
