import { dot } from '../config.js';

export default [
	[
		[
			'how to setup bot',
			'how to setup join logs',
			'how to setup leave logs',
			'how to setup join messages',
			'how to setup leave messages',
			'how to customise template'
		],
		`__Setting up join/leave channels__\n${dot}Use the [/config set](https://i.imgur.com/kWe5qjX.gif) slash command to setup join and leave channels by providing the channel\n\n__Setting up join/leave messages__\n${dot}Use the [\`Set as template\`](https://i.imgur.com/NydLETl.gif) command to setup templates easily!\n${dot}${dot}Use the \`/variables\` for a list of available variables that you can use in your template.\n${dot}You can use an embed builder like [discord.club](<https://discord.club/dashboard>) for making the template. Youtube tutorials are available on how to use embed builders such as discord.club and discohook.\n${dot}Check out this [repo](<https://github.com/Siris01/invite-management-templates>) for a list of premade templates.`
	],
	[['please help', 'help'], 'Please be more specific'],
	[
		['how to stop msgs', 'how to remove template', 'how to use default template'],
		`Use the \`/config reset <setting>\` command\n${dot}Resetting the channel will stop the bot from sending messages\n${dot}Resetting the message will remove the custom template and the bot will start using its deault template`
	],
	[
		['how to reset invites', 'how to reset invite'],
		'Use the `reset` command to reset invites for everyone, mention a speific user to reset invites for them'
	],
	[
		['how to setup verification', 'how to setup password'],
		`[Simple](https://i.imgur.com/9UK9igo.png): Members will have to press a button to get verified This type is effective against automated user accounts.\n[Password](https://i.imgur.com/9OT6UKr.png): Set a pre-defined password which the user has to enter (using buttons) to get verified. Useful if you own a super exclusive server or you just want to hide the password in your rules, ensuring that all new members will actually read your server's rules :)\n[Randomised](https://i.imgur.com/mRGJmt4.png): Make the bot randomise the password (of specified length) which the user has to enter (using buttons) to get verified.`
	]
] as const;
