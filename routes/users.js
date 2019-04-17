const bcrypt = require("bcrypt");
const nodemailer = require('nodemailer');
module.exports = app => {
	const Users = app.db.models.Users;
	var sequelize = app.db.sequelize;
	const transporter = nodemailer.createTransport({
		service:"gmail",
		port: 443,
		auth: {
			user: "notreply.appirrigar@gmail.com",
			pass: "appirrigar2018"
		}
	});
	app.route("/user")
	.all(app.auth.authenticate())
	/**
	* @api {get} /user Exibe usuário autenticado
	* @apiGroup Usuário
	* @apiHeader {String} Authorized Token de usuário
	* @apiHeadferExample {json} Header
	*	{"Authorization": "JWT xyz.abc.123.hgf"}
	* @apiSuccess {Number} id Id de registro
	* @apiSccess {String} name Nome
	* @apiSuccess {String} email Email
	* @apiSuccessExample {json} Sucesso
	*	HTTP/1.1 200 OK
	*	{
	*		"id": 1,
	*		"name": "Danilo Barbosa",
	*		"email": "danilo@barbosa.net"
	*	}
	* @apiErrorExample {json} Erro de consulta
	*	HTTP/1.1 412 Precondition Failed
	*/
	.get((req,res) => {
		Users.findById(req.user.id, {
			attributes: ["id","name","email","password"]
		})
		.then(result => res.json(result))
		.catch(error => {
			res.status(412).json({msg: error.message});
		})
	})
	/**
	* @api {delete} /user Exclui usuário autenticado
	* @apiGroup Usuário
	* @apiHeader {String} Authorization Token de usuário
	* @apiHeaderExample {json} Header
	*    {"Authorization": "JWT xyz.abc.123.hgf"}
	* @apiSuccessExample {json} Sucesso
	*    HTTP/1.1 204 No Content
	* @apiErrorExample {json} Erro na exclusão
	*    HTTP/1.1 412 Precondition Failed
	*/
	.delete((req,res) => {
		Users.destroy({where: {id: req.user.id} })
		.then(result => res.sendStatus(204))
		.catch(error => {
			res.status(412).json({msg: error.message});
		});
	})

	.put((req,res) => {
		const salt = bcrypt.genSaltSync(); 
		req.body.password = bcrypt.hashSync(req.body.password, salt);
		Users.update(req.body, {where: {
			id: req.user.id
		}})
		.then(result => res.sendStatus(204))
		.catch(error => {
			res.status(412).json({msg: error.message});
		});
	});
	/**
	* @api {post} /users Cadastra novo usuário
	* @apiGroup Usuário
	* @apiParam {String} name Nome
	* @apiParam {String} email Email
	* @apiParam {String} password Senha
	* @apiParamExample {json} Entrada
	*    {
	*      "name": "Danilo Barbosa",
	*      "email": "danilo@barbosa.net",
	*      "password": "123456"
	*    }
	* @apiSuccess {Number} id Id de registro
	* @apiSuccess {String} name Nome
	* @apiSuccess {String} email Email
	* @apiSuccess {String} password Senha criptografada
	* @apiSuccess {Date} updated_at Data de atualização
	* @apiSuccess {Date} created_at Data de cadastro
	* @apiSuccessExample {json} Sucesso
	*    HTTP/1.1 200 OK
	*    {
	*      "id": 1,
	*      "name": "Danilo Barbosa",
	*      "email": "danilo@barbosa.net",
	*      "password": "$2a$10$SK1B1",
	*      "updated_at": "2018-03-01T15:46:51.778Z",
	*      "created_at": "2015-02-28T15:46:51.778Z"
	*    }
	* @apiErrorExample {json} Erro no cadastro
	*    HTTP/1.1 412 Precondition Failed
	*/
	app.post("/users", (req,res) => {
		Users.create(req.body)
		.then(result => res.json(result))
		.catch(error => {
			res.status(412).json({msg: error.message});
		});
	});

	app.post("/users/email", (req,res) => {
		let sql = `select decrypt_password, email from users where email = '${req.body.email}'`;
		sequelize.query(sql, { type: sequelize.QueryTypes.SELECT})
		.then(data => {
			let mailOptions = {
				from: 'notreply.appirrigar@gmail.com',
				to: data[0].email,
				subject: 'Recuperação de senha',
				html: '<p>Segue abaixo sua senha.</p> <p>Senha: '+data[0].decrypt_password+'</p> <br> <p>Sua mensagem foi enviada através do APP Irrigar</p>'
			};

			transporter.sendMail(mailOptions, function(error, info){
				if (error) { 
					let retorno = {ret:false};
					res.status(200).json(retorno);
				} else {
					res.status(200).json({ret:true});
				}
			}); 
		})
		.catch(error => {
			res.status(412).json({msg: error.message});
		});
	});
};