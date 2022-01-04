import { Argument, ArgumentContext, PieceContext } from '@sapphire/framework';
interface Emote {
	name?: string;
	id: string;
	animated: boolean;
	url: string;
	emoji?: string;
}

export class EmojiArgument extends Argument<Emote> {
	public constructor(context: PieceContext) {
		super(context, { name: 'emoji' });
	}

	parser = new RegExp(/<(a?)?:(\w+):(\d{18}>)?/, '');
	linkParser = new RegExp(/https:\/\/cdn\.discordapp\.com\/emojis\/(\d+)\.(\w+)/, '');

	public run(parameter: string, context: ArgumentContext<Emote>): Argument.Result<Emote> {
		if (this.parser.test(parameter)) {
			const result = this.parser.exec(parameter)!;
			return this.ok({
				name: result[2],
				id: result[3],
				animated: result[1] === 'a' ? true : false,
				url: `https://cdn.discordapp.com/emojis/${result[3]}.${
					result[1] === 'a' ? 'gif' : 'png'
				}?size=256&quality=lossless`,
				emoji: `<${result[1] === 'a' ? 'a' : ''}:${result[2]}:${result[3]}>`
			});
		}

		if (this.linkParser.test(parameter)) {
			const result = this.linkParser.exec(parameter)!;
			return this.ok({
				name: undefined,
				id: result[1],
				animated: result[2] === 'gif' ? true : false,
				url: result[0],
				emoji: undefined
			});
		}

		return this.error({
			parameter,
			message: 'Unable to parse emoji.',
			context
		});
	}
}

declare module '@sapphire/framework' {
	export interface ArgType {
		emoji: Emote;
	}
}
