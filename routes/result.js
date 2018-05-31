module.exports = app => {
	const Result = app.db.models.Result; 
	var sequelize = app.db.sequelize;
	app.route("/result")
	.all(app.auth.authenticate())	
	.get((req,res) => { 
		Result.findAll({ where: {user_id: req.user.id}})
		.then(result => res.json(result))
		.catch(error => {
			res.status(412).json({msg: error.message});
		});
	})
	.post((req,res) => { 
		req.body.user_id = req.user.id; 
		let sql = `select * from Results where date(data_inclusao) = '${req.body.data_inclusao}'  and user_id = ${req.user.id} and culture_id = ${req.body.culture_id};`;
		sequelize.query(sql, { type: sequelize.QueryTypes.SELECT})
		.then(data => {
			if(data.length > 0){
				Result.update(req.body, {where: {
					id: data[0].id
				}})
				.then(result => res.sendStatus(204))
				.catch(error => {
					res.status(412).json({msg: error.message});
				});
			}else{
				Result.create(req.body)
				.then(result => res.json(result))
				.catch(error => {
					res.status(412).json({msg: error.message});
				});
			}
		})

	});

	app.route("/resultados")
	.all(app.auth.authenticate()) 
	.put((req,res) => {
		Result.update(req.body, {where: {
			id: req.params.id,
			user_id: req.user.id
		}})
		.then(result => res.sendStatus(204))
		.catch(error => {
			res.status(412).json({msg: error.message});
		});
	})
	.get((req,res) => {
		let sql = `select * from Results where user_id = ${req.user.id}  order by data_inclusao desc`;
		if(req.query.id != 0){
			let sql = `select * from Results where user_id = ${req.user.id} and culture_id = ${req.query.id}  order by data_inclusao desc`;
		}
		sequelize.query(sql, { type: sequelize.QueryTypes.SELECT})
		.then(result => res.json(result))
		.catch(error => {
			res.status(412).json({msg: error.message});
		});
	});

	app.route("/result/culturas")
	.all(app.auth.authenticate()) 
	.get((req,res) => {
		let sql = `SELECT distinct c.id, c.descricao FROM cultures c INNER JOIN Results r ON c.id = r.culture_id WHERE r.user_id = ${req.user.id}`;
		sequelize.query(sql, { type: sequelize.QueryTypes.SELECT})
		.then(data => res.json(data))
		.catch(error => {
			res.status(412).json({msg: error.message});
		});
	});
}