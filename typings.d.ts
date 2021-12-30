declare module '*.json' {
	const value: any;
	export default value;
}

interface Command {
	name: string;
	run: CommandCallbackRun;
}
