module.exports = {
	database: "ntask",
	username: "",
	password: "",
	params: {
		dialect: "sqlite",
		storage: "ntask.sqlite",
		define: {
			underscored: true
		},
		operatorsAliases: false
	},
	jwtSecret: "Nta$K-AP1",
	jwtSession: {session: false}
};