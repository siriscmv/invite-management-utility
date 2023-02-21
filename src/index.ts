import { Client, IntentsBitField, Partials, Options } from 'discord.js';
import { readdir } from 'fs/promises';
import { mainBot } from './config';
import { loadCommands } from './utils/commands';

const client = new Client({
	intents: [
		IntentsBitField.Flags.Guilds,
		IntentsBitField.Flags.GuildMessages,
		IntentsBitField.Flags.GuildMessageReactions,
		IntentsBitField.Flags.GuildMembers,
		IntentsBitField.Flags.GuildPresences,
		IntentsBitField.Flags.MessageContent
	],
	partials: [Partials.GuildMember, Partials.Message, Partials.User, Partials.Reaction],
	presence: {
		status: 'online'
	},
	makeCache: Options.cacheWithLimits({
		AutoModerationRuleManager: 0,
		ApplicationCommandManager: 0,
		BaseGuildEmojiManager: 0,
		GuildEmojiManager: 0,
		GuildMemberManager: undefined,
		GuildBanManager: 0,
		GuildForumThreadManager: 0,
		GuildInviteManager: 0,
		GuildScheduledEventManager: 0,
		GuildStickerManager: 0,
		GuildTextThreadManager: 0,
		MessageManager: 100,
		PresenceManager: {
			maxSize: 1,
			keepOverLimit: (presence) => presence.userId === mainBot
		},
		ReactionManager: 0,
		ReactionUserManager: 0,
		StageInstanceManager: 0,
		ThreadManager: 0,
		ThreadMemberManager: 0,
		UserManager: undefined,
		VoiceStateManager: 0
	})
});

const loadEvents = async (client: Client) => {
	const events = await readdir('./events');
	for (const event of events) {
		const { default: run } = await import(`./events/${event}`);
		const eventName = event.split('.')[0];

		if (eventName === 'ready') client.on(eventName, run.bind(null, client));
		else client.on(eventName, run);
	}
};

Promise.all([loadEvents(client), loadCommands()]).then(() => client.login(process.env.DISCORD_TOKEN!));
