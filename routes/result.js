module.exports = app => {
	const Result = app.db.models.Result;
    console.log("aqui")
	app.route("/result")
	.all(app.auth.authenticate())	
	.get((req,res) => {
		Result.findAll({
			where: {user_id: req.user.id}
		})
		.then(result => res.json(result))
		.catch(error => {
			res.status(412).json({msg: error.message});
		});
	})
	.post((req,res) => { 
        req.body.user_id = req.user.id;
        console.log(req.body)
		Result.create(req.body)
		.then(result => res.json(result))
		.catch(error => {
			res.status(412).json({msg: error.message});
		});
	});

	app.route("/result/:id")
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
	});
}