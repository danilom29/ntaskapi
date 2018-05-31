const logger = require("./logger.js");

module.exports = {
	database: "ntask",
	username: "",
	password: "",
	params: {
		dialect: "sqlite",
		storage: "ntask-eto.sqlite",
		logging: false,
		define: {
			underscored: true
		},
		operatorsAliases: false
	},
	jwtSecret: "Nta$K-AP1",
	jwtSession: {session: false}
};