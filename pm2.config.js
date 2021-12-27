module.exports = {
	apps: [
		{
			name: 'imu',
			script: './prod/index.js',
			node_args: '-r dotenv/config'
		}
	]
};
