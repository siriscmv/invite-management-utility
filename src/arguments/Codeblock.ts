// TypeScript:
import { Argument, ArgumentContext, PieceContext } from '@sapphire/framework';

export class CodeblockArgument extends Argument<String> {
	public constructor(context: PieceContext) {
		super(context, { name: 'codeblock', aliases: ['cb'] });
	}

	public run(parameter: string, context: ArgumentContext<string>): Argument.Result<String> {
		const parser = new RegExp(/```(?:(?<lang>\S+)\n)?\s?(?<code>[^]+?)\s?```/, '');
		if (parser.test(parameter)) return this.ok(parser.exec(parameter)![2]);
		return this.error({
			parameter,
			message: 'Unable to parse Codeblock.',
			context
		});
	}
}
