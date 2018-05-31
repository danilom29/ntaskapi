const jwt = require("jwt-simple");

module.exports = app => {
	const cfg = app.libs.config;
	const Users = app.db.models.Users; 
	/**
	* @api {post} /token Token autenticado
	* @apiGroup Credencial
	* @apiParam {String} email Email de Usuário
	* @apiParam {String} password Senha de usuário
	* @apiParamExample {json} Entrada
	*	{
	*		"email": "danilo@connor.net",
	*		"password": "123456"
	*	}
	* @apiSuccess {String} token Token de usuário autenticado
	* @apiSuccessExample {json} Sucesso
	*	HTTP/1.1 200 OK
	*	{"token": "xyz.zbc.123.hgf"}
	* @apiErrorExample {json} Erro de autenticação
	*	HTTP/1.1 401 Unauthorized
	*/
	app.post("/token", (req, res) => { 
		if(req.body.email && req.body.password){
			const email = req.body.email.toLowerCase();
			const password = req.body.password;

			Users.findOne({
				where: {email: email}, 
					logging: true
			}).then(user => { 
				if(Users.isPassword(user.password, password)){
					const payload = {id: user.id}; 
					res.json({
						token: jwt.encode(payload, cfg.jwtSecret)
					});
				}else{
					res.sendStatus(401);
				}
			})
			.catch(error => res.sendStatus(401));
		}else{
			res.sendStatus(401);
		}
	});
};