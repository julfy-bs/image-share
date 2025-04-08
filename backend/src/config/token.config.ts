export default () => ({
	token: {
		refresh: process.env.JWT_REFRESH_SECRET,
		access: process.env.JWT_ACCESS_SECRET,
	}
})