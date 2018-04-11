module.exports = (sequelize,DataType) => {
	const culture = sequelize.define("culture", {
		id: {
			type: DataType.INTEGER,
			primaryKey: true,
			autoIncrement: true
		},
		descricao: {
			type: DataType.STRING,
			allowNull: false,
			validate: {
				notEmpty: true
			}
		}
	}, {
		timestamps: false
    }); 
    
	return culture;
};