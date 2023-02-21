import { Client, IntentsBitField, Partials, Options } from 'discord.js';
import { mainBot } from './config';

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
		MessageManager: 0,
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

client.login(process.env.DISCORD_TOKEN!);
