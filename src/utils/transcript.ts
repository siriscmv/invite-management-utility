import type { SapphireClient } from '@sapphire/framework';
import type { Message, MessageEmbed } from 'discord.js';
import moment from 'moment';
import { URL } from 'url';

export const transcript = async (client: SapphireClient, ticketId: number, channelName: string, msgs: Message[]) => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${channelName} Transcript</title>
    <style>
@font-face{font-family:Whitney;src:url(https://discordapp.com/assets/6c6374bad0b0b6d204d8d6dc4a18d820.woff);font-weight:300}@font-face{font-family:Whitney;src:url(https://discordapp.com/assets/e8acd7d9bf6207f99350ca9f9e23b168.woff);font-weight:400}@font-face{font-family:Whitney;src:url(https://discordapp.com/assets/3bdef1251a424500c1b3a78dea9b7e57.woff);font-weight:500}@font-face{font-family:Whitney;src:url(https://discordapp.com/assets/be0060dafb7a0e31d2a1ca17c0708636.woff);font-weight:600}@font-face{font-family:Whitney;src:url(https://discordapp.com/assets/8e12fb4f14d9c4592eb8ec9f22337b04.woff);font-weight:700}body{font-family:Whitney,"Helvetica Neue",Helvetica,Arial,sans-serif;font-size:17px}a{text-decoration:none}a:hover{text-decoration:underline}img{object-fit:contain}.markdown{white-space:pre-wrap;line-height:1.3;overflow-wrap:break-word}.quote{border-left:4px solid;border-radius:3px;margin:8px 0;padding-left:10px}.pre{font-family:Consolas,"Courier New",Courier,monospace}.pre--multiline{margin-top:4px;padding:8px;border:2px solid;border-radius:5px}code{font-family:Consolas,Andale Mono WT,Andale Mono,Lucida Console,Lucida Sans Typewriter,DejaVu Sans Mono,Bitstream Vera Sans Mono,Liberation Mono,Nimbus Mono L,Monaco,Courier New,Courier,monospace;border:0;font-weight:inherit;font-style:inherit;vertical-align:baseline}code.inline{width:auto;height:auto;padding:.2em;margin:-0.2em 0;border-radius:3px;font-size:85%;font-family:Consolas,Andale Mono WT,Andale Mono,Lucida Console,Lucida Sans Typewriter,DejaVu Sans Mono,Bitstream Vera Sans Mono,Liberation Mono,Nimbus Mono L,Monaco,Courier New,Courier,monospace;text-indent:0;border:0;white-space:pre-wrap;background-color:#2f3136;border:1px solid #2f3136}code.block{display:block;overflow-x:auto;padding:.5em;margin:.5em;margin-left:0;border-radius:4px;border:1px solid #2f3136;background-color:#2f3136;color:#b9bbbe;text-size-adjust:none}.mention{font-weight:500}.emoji{width:1.45em;height:1.45em;margin:0 1px;vertical-align:-0.4em}.emoji--small{width:1rem;height:1rem}.emoji--large{width:2rem;height:2rem}.info{display:flex;max-width:100%;margin:0 5px 10px}.info__guild-icon-container{flex:0}.info__guild-icon{max-width:88px;max-height:88px}.info__metadata{flex:1;margin-left:10px}.info__guild-name{font-size:1.4em}.info__channel-name{font-size:1.2em}.info__channel-topic{margin-top:2px}.info__channel-message-count{margin-top:2px}.info__channel-date-range{margin-top:2px}.chatlog{max-width:100%;margin-bottom:24px}.chatlog__message-group{display:flex;margin:0 10px;padding:15px 0;border-top:1px solid}.chatlog__author-avatar-container{flex:0;width:40px;height:40px}.chatlog__author-avatar{border-radius:50%;height:40px;width:40px}.chatlog__messages{flex:1;min-width:50%;margin-left:20px}.chatlog__author-name{font-size:1em;font-weight:500}.chatlog__timestamp{margin-left:5px;font-size:.75em}.chatlog__message{padding:2px 5px;margin-right:-5px;margin-left:-5px;background-color:transparent;transition:background-color 1s ease}.chatlog__content{font-size:.9375em;word-wrap:break-word}.chatlog__edited-timestamp:hover{margin-left:3px;font-size:.8em}.chatlog__attachment-thumbnail{margin-top:5px;max-width:50%;max-height:500px;border-radius:3px}.chatlog__embed{margin-top:5px;display:flex;max-width:520px}.chatlog__embed-color-pill{flex-shrink:0;width:4px;border-top-left-radius:3px;border-bottom-left-radius:3px}.chatlog__embed-content-container{display:flex;flex-direction:column;padding:8px 10px;border:1px solid;border-top-right-radius:3px;border-bottom-right-radius:3px}.chatlog__embed-content{width:100%;display:flex}.chatlog__embed-text{flex:1}.chatlog__embed-author{display:flex;align-items:center;margin-bottom:5px}.chatlog__embed-author-icon{width:20px;height:20px;margin-right:9px;border-radius:50%}.chatlog__embed-author-name{font-size:.875em;font-weight:600}.chatlog__embed-title{margin-bottom:4px;font-size:.875em;font-weight:600}.chatlog__embed-description{font-weight:500;font-size:14px}.chatlog__embed-fields{display:flex;flex-wrap:wrap}.chatlog__embed-field{flex:0;min-width:100%;max-width:506px;padding-top:10px}.chatlog__embed-field--inline{flex:1;flex-basis:auto;min-width:150px}.chatlog__embed-field-name{margin-bottom:4px;font-size:.875em;font-weight:600}.chatlog__embed-field-value{font-size:.875em;font-weight:500}.chatlog__embed-thumbnail{flex:0;margin-left:20px;max-width:80px;max-height:80px;border-radius:3px}.chatlog__embed-image-container{margin-top:10px}.chatlog__embed-image{max-width:500px;max-height:400px;border-radius:3px}.chatlog__embed-footer{margin-top:10px}.chatlog__embed-footer-icon{margin-right:4px;width:20px;height:20px;border-radius:50%;vertical-align:middle}.chatlog__embed-footer-text{font-weight:500;font-size:.75em}.chatlog__reactions{display:flex}.chatlog__reaction{display:flex;align-items:center;margin:6px 2px 2px;padding:3px 6px;border-radius:3px}.chatlog__reaction-count{min-width:9px;margin-left:6px;font-size:.875em}.chatlog__bot-tag{margin-left:.3em;background:#7289da;color:#fff;font-size:.625em;padding:1px 2px;border-radius:3px;vertical-align:middle;line-height:1.3;position:relative;top:-0.2em}body{background-color:#36393e;color:#dcddde}a{color:#0096cf}.spoiler{background-color:#202225;color:#202225;cursor:pointer;border-radius:3px}.spoiler_clicked{opacity:1;transition:all .1s ease;color:#dcddde}.quote{border-color:#4f545c}.pre{background-color:#2f3136!important}.pre--multiline{border-color:#282b30!important;color:#839496!important}.mention{color:#7289da}.info__guild-name{color:#fff}.info__channel-name{color:#fff}.info__channel-topic{color:#fff}.chatlog__message-group{border-color:rgba(255,255,255,0.1)}.chatlog__author-name{color:#fff}.chatlog__timestamp{color:rgba(255,255,255,0.2)}.chatlog__message--highlighted{background-color:rgba(114,137,218,0.2)!important}.chatlog__message--pinned{background-color:rgba(249,168,37,0.05)}.chatlog__edited-timestamp:hover{color:rgba(255,255,255,0.2)}.chatlog__embed-content-container{background-color:rgba(46,48,54,0.3);border-color:rgba(46,48,54,0.6)}.chatlog__embed-author-name{color:#fff}.chatlog__embed-author-name-link{color:#fff}.chatlog__embed-title{color:#fff}.chatlog__embed-description{color:rgba(255,255,255,0.6)}.chatlog__embed-field-name{color:#fff}.chatlog__embed-field-value{color:rgba(255,255,255,0.6)}.chatlog__embed-footer{color:rgba(255,255,255,0.6)}.chatlog__reaction{background-color:rgba(255,255,255,0.05)}.chatlog__reaction-count{color:rgba(255,255,255,0.3)}.edited{font-size:.625rem;font-weight:400;line-height:1;user-select:none;color:#72767d}
	</style>
</head>
<body>
<div class=info>
    <div class=info__guild-icon-container><img class=info__guild-icon src=https://cdn.discordapp.com/attachments/874646321880006717/941618141610532924/pfp.png></div>
    <div class=info__metadata>
        <div class=info__guild-name>Ticket Id: ${ticketId}</div>
        <div class=info__channel-name>#${channelName}</div>
        <div class=info__channel-message-count>${msgs.length} messages</div>
    </div>
</div>
<div class=chatlog>
${msgs
	.map((msg) => {
		return `
      <div class=chatlog>
      <div class=chatlog__message-group>
        <div class=chatlog__author-avatar-container><img class=chatlog__author-avatar src=${msg.author.displayAvatarURL(
					{ dynamic: true }
				)}></div>
        <div class=chatlog__messages>
          <span class=chatlog__author-name title="${msg.author.tag}" data-user-id=${msg.author.id}>
            ${msg.author.username}</span>${msg.author.bot ? '<span class=chatlog__bot-tag>BOT</span>' : ''}
            <span class=chatlog__timestamp>${moment(msg.createdTimestamp).format('ddd MMM Do, YYYY hh:mm a')}</span>
          <div class=chatlog__message id=message-${msg.id} data-message-id=${msg.id}>
            <div class="chatlog__content">
            ${getContent(client, msg, msg.content)}
              ${
								msg.attachments.size
									? msg.attachments.map((attachment) => {
											return `<div class=chatlog__attachment><a href=${attachment.url}><img class=chatlog__attachment-thumbnail src=${attachment.url}></a></div>`;
									  })
									: ''
							}
              ${msg.embeds.length ? msg.embeds.map((embed) => getEmbed(client, msg, embed)).join('\n') : ''}
              ${
								msg.reactions.cache.size
									? `<div class=chatlog__reactions>
              <div class=chatlog__reactions>
              ${msg.reactions.cache
								.map((reaction) => {
									return `<div class=chatlog__reaction><img class=emoji--small alt=${reaction.emoji.name} title=${
										reaction.emoji.name
									} src="${
										reaction.emoji.url
											? reaction.emoji.url
											: `https://twemoji.maxcdn.com/2/72x72/${emojiUnicode(reaction.emoji.name!)}.png`
									}"><span class=chatlog__reaction-count>1</span></div>`;
								})
								.join('\n')}
              </div>
            </div>
            </div>`
									: ''
							}
          </div>
        </div>
      </div>
	  </div>
            `;
	})
	.join('\n')}
</div>
<script>
function unHideSpoiler() {
	document.getElementById('spoiler').style.color = '#dcddde';
	document.getElementById('spoiler').style.backgroundColor = 'rgba(255,255,255,.1)';
  }
</script>
</body>
</html>
`;

function getContent(client: SapphireClient, msg: Message, content: string) {
	if (!content) return '<span> </span>';
	if (['> ', '>> '].some((c) => content.startsWith(c))) content = content.slice(2);
	content = filterContent(content);
	const contentArray = content.split(' ');
	const newContent = [];
	for (const text of contentArray) {
		if (['<@&', '<@', '<#'].some((t) => text.startsWith(t)) && text.endsWith('>'))
			newContent.push(getMention(client, msg, text));
		else newContent.push(text);
	}
	return newContent.join(' ');
}

/**
 * @param {Client} client
 * @param {Message} msg
 * @param {string} text
 * @returns {string}
 */
function getMention(client: SapphireClient, msg: Message, text: string) {
	const id = text.replace(/<|>|@|&|#|!/gi, '');
	let type;
	if (text.startsWith('<@&')) type = 'role';
	else if (text.startsWith('<@')) type = 'user';
	else if (text.startsWith('<#')) type = 'channel';
	else return text;
	switch (type) {
		case 'user':
			return `<span class=mention title=${client.users.cache.get(id)?.tag || id}>@${
				client.users.cache.get(id)?.username || id
			}</span>`;
		case 'channel':
			return `<span class=mention title=${msg.guild!.channels.cache.get(id)?.name || id}>#${
				msg.guild!.channels.cache.get(id)?.name || id
			}</span>`;
		case 'role':
			return `<span class=mention title=${msg.guild!.roles.cache.get(id)?.name || id}>@${
				msg.guild!.roles.cache.get(id)?.name || id
			}</span>`;
	}

	return '';
}

/**
 * @param {Client} client
 * @param {Message} msg
 * @param {MessageEmbed} embed
 * @returns {string}
 */
function getEmbed(client: SapphireClient, msg: Message, embed: MessageEmbed) {
	return `<div class=chatlog__embed>
  <div class=chatlog__embed-color-pill style=background-color:#${embed.color?.toString(16) || '000000'}></div>
  <div class=chatlog__embed-content-container>
    <div class=chatlog__embed-content>
      <div class=chatlog__embed-text>
        <div class=chatlog__embed-description><span class="markdown">${getContent(
					client,
					msg,
					embed.description!
				)}</span>
        ${
					embed.image
						? `<div class=chatlog__embed-image-container><div class=chatlog__embed-image>${embed.image.url}</div></div>`
						: ''
				}
        </div>
        ${
					embed.fields.length
						? `<div class=chatlog__embed-fields>${embed.fields.map(
								(field) => `<div class=chatlog__embed-field><div class=chatlog__embed-field-name>${
									field.name
								}</div><div class="chatlog__embed-field-value">${getContent(client, msg, field.value)}${
									field.inline ? '<div class=chatlog__embed-field>--inline></div>' : ''
								}</div></div>
        </div>`
						  )}</div>`
						: ''
				}
      </div>
      ${
				embed.thumbnail
					? `<div class=chatlog__embed-thumbnail-container><a class=chatlog__embed-thumbnail-link><img class=chatlog__embed-thumbnail src="${embed.thumbnail.url}"></a></div>`
					: ''
			}
     </div>
    ${
			embed.footer
				? `<div class=chatlog__embed-footer>${
						embed.footer.iconURL ? `<img class=chatlog__embed-footer-icon src=${embed.footer.iconURL}></img>` : ''
				  }<span class=chatlog__embed-footer-text>${embed.footer.text}</span></div>`
				: ''
		}
  </div>
</div>`;
}

/**
 * @param {string} emoji
 * @returns {string}
 */
function emojiUnicode(emoji: string) {
	let comp;
	if (emoji.length === 1) {
		comp = emoji.charCodeAt(0);
	}
	comp = (emoji.charCodeAt(0) - 0xd800) * 0x400 + (emoji.charCodeAt(1) - 0xdc00) + 0x10000;
	if (comp < 0) {
		comp = emoji.charCodeAt(0);
	}
	return comp.toString(16);
}

/**
 * @param {string} content
 * @returns {string}
 */
function filterContent(content: string) {
	const backtick = 0xdeadbeef * '`'.codePointAt(0)!,
		asterik = 0xdeadbeef * '*'.codePointAt(0)!,
		tilde = 0xdeadbeef * '~'.codePointAt(0)!,
		underscore = 0xdeadbeef * '_'.codePointAt(0)!,
		pipe = 0xdeadbeef * '|'.codePointAt(0)!,
		sign = 0xdeadbeef * '>'.codePointAt(0)!,
		square_bracket_left = 0xdeadbeef * '['.codePointAt(0)!,
		square_bracket_right = 0xdeadbeef * ')'.codePointAt(0)!,
		bracket_left = 0xdeadbeef * '('.codePointAt(0)!,
		bracket_right = 0xdeadbeef * ')'.codePointAt(0)!;

	const codes = {
		'\\`': backtick.toString(),
		'\\*': asterik.toString(),
		'\\~': tilde.toString(),
		'\\_': underscore.toString(),
		'\\|': pipe.toString(),
		'\\>': sign.toString(),
		'\\[': square_bracket_left.toString(),
		'\\]': square_bracket_right.toString(),
		'\\(': bracket_left.toString(),
		'\\)': bracket_right.toString()
	};

	const reverseCodes = {
		[backtick]: '\\`',
		[asterik]: '\\*',
		[tilde]: '\\~',
		[underscore]: '\\_',
		[pipe]: '\\|',
		[sign]: '\\>',
		[square_bracket_left]: '\\[',
		[square_bracket_right]: '\\]',
		[bracket_left]: '\\(',
		[bracket_right]: '\\)'
	};

	let filteredContent = content.replace(/\n/gm, '<br>');
	filteredContent = filteredContent.replace(/\[\]\(.*?\)/gm, '');
	filteredContent = filteredContent.replace(/(?=.+\])\(\)/gm, '');
	filteredContent = filteredContent.split(/ +/gm).join(' ');
	filteredContent = content.replace(/(\\)(`|\*|~|_|\||\[|\]|\(|\))/gm, (value) => codes[value as keyof typeof codes]);

	// Asterik
	while (filteredContent.match(/\*\*((\n)*((\n)*.+?(\n)*)+?(\n)*)+?\*\*/gm)) {
		filteredContent = filteredContent.replace(
			/\*\*((\n)*((\n)*.+?(\n)*)+?(\n)*)+?\*\*/gm,
			(value) => `<strong>${value.slice(2, -2)}</strong>`
		);
		filteredContent = filteredContent.replace(
			/\*((\n)*((\n)*.+?(\n)*)+?(\n)*)+?\*/gm,
			(value) => `<em>${value.slice(1, -1)}</em>`
		);
	}

	// Underscore
	while (filteredContent.match(/__((\n)*((\n)*.+?(\n)*)+?(\n)*)+?__|_((\n)*((\n)*.+?(\n)*)+?(\n)*)+?_/gm)) {
		filteredContent = filteredContent.replace(
			/__((\n)*((\n)*.+?(\n)*)+?(\n)*)+?__/gm,
			(value) => `<u>${value.slice(2, -2)}</u>`
		);
		filteredContent = filteredContent.replace(
			/_((\n)*((\n)*.+?(\n)*)+?(\n)*)+?_/gm,
			(value) => `<em>${value.slice(2, -2)}</em>`
		);
	}

	// Backtick
	while (
		filteredContent.match(
			/```((\n)*((\n)*.+?(\n)*)+?(\n)*)+?```|``((\n)*((\n)*.+?(\n)*)+?(\n)*)+?``|`((\n)*((\n)*.+?(\n)*)+?(\n)*)+?`/gm
		)
	) {
		filteredContent = filteredContent.replace(
			/```((\n)*((\n)*.+?(\n)*)+?(\n)*)+?```/gm,
			(value) => `<code class="block">${value.slice(3, -3)}</code>`
		);
		filteredContent = filteredContent.replace(
			/``((\n)*((\n)*.+?(\n)*)+?(\n)*)+?``/gm,
			(value) => `<code class="inline">${value.slice(2, -2)}</code>`
		);
		filteredContent = filteredContent.replace(
			/`((\n)*((\n)*.+?(\n)*)+?(\n)*)+?`/gm,
			(value) => `<code class="inline">${value.slice(1, -1)}</code>`
		);
	}

	// Quotes
	if (filteredContent.match(/^>\s/m)) {
		filteredContent = filteredContent.replace(
			/^> .+[?\n]/gm,
			(value) => `<span class="quote">${value.slice(2)}</span>`
		);
	}
	if (filteredContent.match(/((^>> .+)(.+|\n.+)*)/gm)) {
		filteredContent = filteredContent.replace(
			/((^>> .+)(.+|\n.+)*)/gm,
			(value) => `<div class="quote">${value.slice(3)}</div>`
		);
	}

	// Tilde
	while (filteredContent.match(/~~((\n)*((\n)*.+?(\n)*)+?(\n)*)+?~~/gm)) {
		filteredContent = filteredContent.replace(
			/~~((\n)*((\n)*.+?(\n)*)+?(\n)*)+?~~/gm,
			(value) => `<s>${value.slice(2, -2)}</s>`
		);
	}

	// Pipe
	while (filteredContent.match(/\|\|((\n)*((\n)*.+?(\n)*)+?(\n)*)+?\|\|/gm)) {
		filteredContent = filteredContent.replace(
			/\|\|((\n)*((\n)*.+?(\n)*)+?(\n)*)+?\|\|/gm,
			(value) => `<span id="spoiler" onClick="unHideSpoiler()" class="spoiler">${value.slice(2, -2)}</span>`
		);
	}

	// HyperLink
	if (filteredContent.match(/\[(?!\]).+?\]\(.+?\)/gm)) {
		filteredContent = filteredContent.replace(/\[(?!\]).+?\]\(.+?\)/gm, (value) => {
			const text = value.match(/(?<=\[).+?(?=\])/gm)![0];
			const link = value.match(/(?<=\().+?(?=\))/gm)![0];
			const isUrl = getUrl(link);
			if (!isUrl) return text;
			return `<a href="${isUrl.href}">${text}</a>`;
		});
	}
	const regex = new RegExp(
		`${backtick}|${asterik}|${tilde}|${underscore}|${pipe}|${sign}|${square_bracket_left}|${square_bracket_right}|${bracket_left}|${bracket_right}`,
		'g'
	);
	filteredContent = filteredContent.replace(
		regex,
		(value) => reverseCodes[value as unknown as keyof typeof reverseCodes]
	);
	return filteredContent;
}

/**
 * @param {string} url
 * @returns {URL|null}
 */
function getUrl(url: string) {
	if (/^<.+>$/.test(url)) url = url.slice(1, -1);
	try {
		return new URL(url);
	} catch (err) {
		console.log(err);
		return null;
	}
}
