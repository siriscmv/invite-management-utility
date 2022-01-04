import { Argument, ArgumentContext, PieceContext } from '@sapphire/framework';
import type { Sticker } from 'discord.js';

export class StickerArgument extends Argument<Sticker[]> {
	public constructor(context: PieceContext) {
		super(context, { name: 'sticker' });
	}

	public run(parameter: string, context: ArgumentContext<Sticker[]>): Argument.Result<Sticker[]> {
		if (context.message.stickers.size) return this.ok(context.message.stickers.map((s) => s));
		return this.error({
			parameter,
			message: 'Unable to parse stickers.',
			context
		});
	}
}

declare module '@sapphire/framework' {
	export interface ArgType {
		sticker: Sticker[];
	}
}
