const reportHtml = require('../libs/gerarHtmlReport')();
const axios = require('axios');
const querystring = require('querystring');
const nodemailer = require('nodemailer');
module.exports = app => {
	const transporter = nodemailer.createTransport({
		service:"gmail",
		auth: {
			user: "mdanilo.13@gmail.com",
			pass: "pompom23"
		},
		tls: { rejectUnauthorized: false }
	});
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

	app.route("/resultados/:id")
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
		req.params.id == 0 ? sql = `select cast(radiacao as text) as radiacao,cast(eto as text) as eto,cast(etc as text) as etc,cast(litro_vaso * 1000 as text) as resultado, cast((litro_vaso * 1000) * 1.3 as text) as trinta, strftime('%d-%m-%Y', data_inclusao) as data_inclusao, tmax, tmed, tmin, kc, area, eficiencia from Results where user_id = ${req.user.id}  order by data_inclusao desc` : sql = `select cast(radiacao as text) as radiacao,cast(eto as text) as eto,cast(etc as text) as etc,cast(litro_vaso * 1000 as text) as resultado, cast((litro_vaso * 1000) * 1.3 as text) as trinta, strftime('%d-%m-%Y', data_inclusao) as data_inclusao from Results where user_id = ${req.user.id} and culture_id = ${req.params.id}  order by data_inclusao desc`;
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

	app.route("/result/report")
	.all(app.auth.authenticate())	
	.post((req,res) => {
		let email = req.body.email;
		const typeReturn = (phantomConfig, html) => {
			let rotaInterna = phantomConfig.rotaInterna;
            if (rotaInterna) {
                // Gerar pdf internamente
                // axios.post(rotaInterna, querystring.stringify({
                //     name: phantomConfig.name,
                //     excluir: phantomConfig.excluir || false,
                //     tipoPDF: phantomConfig.tipoPDF,
                //     html: html
                // }))
                // .then(response => {
                // })
                // .catch( () => res.status(412));
                    out({ret:true});
            } else {
                // Retorna html 
                res.send(html);
            }

            function out(data) { console.log("entrou")
            	if(data.ret){
            		console.log("if")
					let mailOptions = {
						from: 'mdanilo.13@gmail.com',
						to: email,
						subject: 'Relatório de Resultados',
						text: 'Bem fácil, não? ;)',
						attachments: [{ // Basta incluir esta chave e listar os anexos
							filename: 'relatorio.pdf', // O nome que aparecerá nos anexos
							path: './midias/'+phantomConfig.name+'.pdf' // O arquivo será lido neste local ao ser enviado
						}]
					};
					console.log(mailOptions)
					transporter.sendMail(mailOptions, function(error, info){
						if (error) { console.log(error)
						  let retorno = {ret:false};
						  res.status(200).json(retorno);
						} else {
							console.log("email enviado")
						  res.status(200).json(data);
						}
					});            		
            	}else{
            		console.log("else")
	                res.status(200).json(data);
            	}
            }

            res.status(412);
        }
		let html = reportHtml.preview({
            problemas: req.body.data
		});
		typeReturn(req.body.phantom, html);
	});
}