const Sequelize = require("Sequelize");
const config = require("./libs/config.js");
let sequelize = null;

console.log(config)
module.export = () => {
	if(!sequelize){
		sequelize = new Sequelize(
			config.database,
			config.username,
			config.password,
			config.params
		);
	}
	return sequelize;
}