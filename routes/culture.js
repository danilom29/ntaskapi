module.exports = app => {
	const culture = app.db.models.culture; 
	const Stages = app.db.models.Stages; 
	var sequelize = app.db.sequelize;
	app.route("/culture")
	.all(app.auth.authenticate())	
	.get((req,res) => { 
		culture.findAll()
		.then(dado => res.json(dado))
		.catch(error => {
			res.status(412).json({msg: error.message});
		});
	})
	.post((req,res) => { 
		// req.body.user_id = req.user.id; 
        culture.create(req.body)
        .then(dado => res.json(dado))
        .catch(error => {
            res.status(412).json({msg: error.message});
        });

    });

	app.route("/culture/:id")
	.all(app.auth.authenticate()) 
	.put((req,res) => {
		culture.update(req.body, {where: {
			id: req.params.id,
			user_id: req.user.id
		}})
		.then(dado => res.sendStatus(204))
		.catch(error => {
			res.status(412).json({msg: error.message});
		});
    });
    
	app.route("/stages")
	.all(app.auth.authenticate())	
	.get((req,res) => { 
		Stages.findAll()
		.then(dado => res.json(dado))
		.catch(error => {
			res.status(412).json({msg: error.message});
		});
	})
}