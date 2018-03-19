module.exports = (sequelize,DataType) => {
	const Result = sequelize.define("Result", {
		id: {
			type: DataType.INTEGER,
			primaryKey: true,
			autoIncrement: true
		},
		radiacao: {
			type: DataType.DOUBLE,
			allowNull: false,
			validate: {
				notEmpty: true
			}
        },
		eto: {
			type: DataType.DOUBLE,
			allowNull: false,
			validate: {
				notEmpty: true
			}
        },
		etc: {
			type: DataType.DOUBLE,
			allowNull: false,
			validate: {
				notEmpty: true
			}
        },
		litro_vaso: {
			type: DataType.DOUBLE,
			allowNull: false,
			validate: {
				notEmpty: true
			}
		},
		done: {
			type: DataType.BOOLEAN,
			allowNull: false,
			defaultValue: false
		}
	});

	Result.associate = (models) => {
		Result.belongsTo(models.Users);
	}
	return Result;
};