import { Argument, ArgumentContext, PieceContext } from '@sapphire/framework';

export class CodeblockArgument extends Argument<String> {
	public constructor(context: PieceContext) {
		super(context, { name: 'codeblock', aliases: ['cb'] });
	}

	parser = new RegExp(/```(?:(?<lang>\S+)\n)?\s?(?<code>[^]+?)\s?```/, '');

	public run(parameter: string, context: ArgumentContext<string>): Argument.Result<String> {
		if (this.parser.test(parameter)) return this.ok(this.parser.exec(parameter)![2]);
		return this.error({
			parameter,
			message: 'Unable to parse Codeblock.',
			context
		});
	}
}

declare module '@sapphire/framework' {
	export interface ArgType {
		codeblock: string;
	}
}
