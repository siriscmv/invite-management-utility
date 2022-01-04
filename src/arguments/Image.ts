import { Argument, ArgumentContext, PieceContext } from '@sapphire/framework';
import type { MessageAttachment } from 'discord.js';

export class ImageArgument extends Argument<MessageAttachment[]> {
	public constructor(context: PieceContext) {
		super(context, { name: 'image' });
	}

	public run(parameter: string, context: ArgumentContext<MessageAttachment[]>): Argument.Result<MessageAttachment[]> {
		if (context.message.attachments.filter((a) => a.contentType?.startsWith('image/') ?? false).size)
			return this.ok(
				context.message.attachments.filter((a) => a.contentType?.startsWith('image/') ?? false).map((d) => d)
			);

		return this.error({
			parameter,
			message: 'Unable to parse Images.',
			context
		});
	}
}

declare module '@sapphire/framework' {
	export interface ArgType {
		image: MessageAttachment[];
	}
}
