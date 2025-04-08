export default () => ({
	database: {
		type: process.env.DATABASE_TYPE,
		url: process.env.DATABASE_URL,
		port: parseInt(process.env.DATABASE_PORT, 10),
		username: process.env.DATABASE_USER,
		password: process.env.DATABASE_PASSWORD,
		database: process.env.DATABASE_NAME,
		entities: ['dist/*/entities/*.entity.js'],
		synchronize: process.env.DATABASE_SYNCHRONIZE,
	},
})