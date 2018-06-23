module.exports = app => {
	const KC_Value = app.db.models.KC_Value; 
	const culture = app.db.models.culture; 
	var sequelize = app.db.sequelize;
	app.route("/kc")
	.all(app.auth.authenticate())	
	.post((req,res) => { console.log
		if(typeof req.body.culture_id == "string"){
			req.body.descricao = req.body.culture_id;	
			req.body.user_id = req.user.id;
	        culture.create(req.body)
	        .then(data => { 
				req.body.culture_id = data.id; 
				req.body.user_id = req.user.id;
				KC_Value.create(req.body)
				.then(response => res.json(response))
				.catch(error => {
					res.status(412).json({msg: error.message});
				});
			})
	        .catch(error => {
	            res.status(412).json({msg: error.message});
	        });			
		}else{
			req.body.culture_id = req.body.culture_id.id; 
			req.body.user_id = req.user.id;
			KC_Value.create(req.body)
			.then(response => res.json(response))
			.catch(error => {
				res.status(412).json({msg: error.message});
			});
		}

	});

	app.route("/kc/value")
	.all(app.auth.authenticate()) 
	.post((req,res) => {
		let sql = `select kc.kc from KC_Values kc 
		inner join cultures c on kc.culture_id = c.id
		INNER JOIN Stages s on kc.stage_id = s.id
		where kc.culture_id = ${req.body.culture_id.id} and kc.stage_id = ${req.body.stage_id} and umidade_maior_setenta = ${req.body.umidade_maior_setenta} 
		and (kc.user_id = ${req.user.id} or kc.user_id is null)`;
		sequelize.query(sql, { type: sequelize.QueryTypes.SELECT})
		.then(data => res.json(data))
		.catch(error => {
			res.status(412).json({msg: error.message});
		});
	});

	app.route("/kc/temp")
	.all(app.auth.authenticate())	
	.post((req,res) => { 
		req.body.culture_id = req.body.culture_id.id;
		KC_Value.create(req.body)
		.then(response => res.json(response))
		.catch(error => {
			res.status(412).json({msg: error.message});
		});

	});
}