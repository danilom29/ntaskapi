module.exports = app => {
	const KC_Value = app.db.models.KC_Value; 
	const culture = app.db.models.culture; 
	var sequelize = app.db.sequelize;
	app.route("/kc")
	.all(app.auth.authenticate())	
	.post((req,res) => { 		
        culture.create(req.body)
        .then(data => { 
			req.body.culture_id = data.id; 
			req.body.stage_id = req.body.stage; 
			KC_Value.create(req.body)
			.then(response => res.json(response))
			.catch(error => {
				res.status(412).json({msg: error.message});
			});
		})
        .catch(error => {
            res.status(412).json({msg: error.message});
        });

	});

	app.route("/kc/value")
	.all(app.auth.authenticate()) 
	.post((req,res) => {
		let sql = `select kc.* from KC_Values kc 
		inner join cultures c on kc.culture_id = c.id
		INNER JOIN Stages s on kc.stage_id = s.id
		where kc.culture_id = ${req.body.culture_id} and kc.stage_id = ${req.body.stage_id} and umidade_maior_setenta = ${req.body.umidade_maior_setenta}`;
		sequelize.query(sql, { type: sequelize.QueryTypes.SELECT})
		.then(data => res.json(data))
		.catch(error => {
			res.status(412).json({msg: error.message});
		});
	});
}