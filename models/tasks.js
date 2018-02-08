module.exports = app => {
	return {
		findAll: (params,callback) => {
			return callback([
				{title: "Fazer compra"},
				{title: "Consertar o pc"},
			])
		}
	};
};