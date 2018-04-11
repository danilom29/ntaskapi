module.exports = (sequelize,DataType) => {
	const Stages = sequelize.define("Stages", {
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
    
	return Stages;
};