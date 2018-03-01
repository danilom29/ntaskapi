const logger = require("./logger.js");

module.exports = {
	database: "ntask",
	username: "",
	password: "",
	params: {
		dialect: "sqlite",
		storage: "ntask.sqlite",
		logging: (sql) => {
			logger.info(`[${new Date()}] ${sql}`);
		},
		define: {
			underscored: true
		},
		operatorsAliases: false
	},
	jwtSecret: "Nta$K-AP1",
	jwtSession: {session: false}
};