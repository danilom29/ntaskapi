module.exports = (sequelize,DataType) => {
	const KC_Value = sequelize.define("KC_Value", {
		id: {
			type: DataType.INTEGER,
			primaryKey: true,
			autoIncrement: true
		},
		umidade_maior_setenta: {
			type: DataType.INTEGER,
			allowNull: false,
			validate: {
				notEmpty: true
			}
        },
		kc: {
			type: DataType.DOUBLE,
			allowNull: false,
			validate: {
				notEmpty: true
			}
		}
	}, {
		timestamps: false
	});

	KC_Value.associate = (models) => {
		KC_Value.belongsTo(models.culture);
		KC_Value.belongsTo(models.Stages);
	}
	return KC_Value;
};