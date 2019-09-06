const reportHtml = require('../libs/gerarHtmlReport')();
const axios = require('axios');
const querystring = require('querystring');
const nodemailer = require('nodemailer');
const fs = require('fs')
const conversionFactory = require('html-to-xlsx')
const puppeteer = require('puppeteer')
const chromeEval = require('chrome-page-eval')({ puppeteer }, {args: ['--no-sandbox', '--disable-setuid-sandbox']})
const conversion = conversionFactory({
  extract: chromeEval
});
var jsreport = require('jsreport-core')()
jsreport.use(require('jsreport-html-to-xlsx')())
module.exports = app => {
	const transporter = nodemailer.createTransport({
		service:"gmail",
		port: 443,
		auth: {
			user: "notreply.appirrigar@gmail.com",
			pass: "appirrigar2019"
		}
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
		// let sql = `select * from Results where date(data_inclusao) = '${req.body.data_inclusao}'  and user_id = ${req.user.id} and culture_id = ${req.body.culture_id};`;
		// sequelize.query(sql, { type: sequelize.QueryTypes.SELECT})
		// .then(data => {
		// 	// if(data.length > 0){
		// 	// 	Result.update(req.body, {where: {
		// 	// 		id: data[0].id
		// 	// 	}})
		// 	// 	.then(result => res.sendStatus(204))
		// 	// 	.catch(error => {
		// 	// 		res.status(412).json({msg: error.message});
		// 	// 	});
		// 	// }else{
		// 	// }
		// })
		Result.create(req.body)
		.then(result => res.json(result))
		.catch(error => {
			res.status(412).json({msg: error.message});
		});

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
		req.params.id == 0 ? sql = `select R.id, cast(R.radiacao as text) as radiacao, cast(R.eto as text) as eto, cast(R.etc as text) as etc, cast(R.litro_vaso * 1000 as text) as resultado, cast((R.litro_vaso * 1000) * 1.3 as text) as trinta, strftime('%d/%m/%Y', R.data_inclusao) as data_inclusao, R.tmax, R.tmed, R.tmin, R.kc, R.area, R.eficiencia, C.descricao as cultura from cultures C inner join Results R on C.id = R.culture_id where R.user_id = ${req.user.id} order by R.id desc` : sql = `select R.id, cast(R.radiacao as text) as radiacao, cast(R.eto as text) as eto, cast(R.etc as text) as etc, cast(R.litro_vaso * 1000 as text) as resultado, cast((R.litro_vaso * 1000) * 1.3 as text) as trinta, strftime('%d/%m/%Y', R.data_inclusao) as data_inclusao, R.tmax, R.tmed, R.tmin, R.kc, R.area, R.eficiencia, C.descricao as cultura from cultures C inner join Results R on C.id = R.culture_id where R.user_id = ${req.user.id} and R.culture_id = ${req.params.id} order by R.id desc`;
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
		let jsreportStarted = false;
		const returnPdf = (phantomConfig, html) => {
			let rotaInterna = phantomConfig.rotaInterna;
            if (rotaInterna) {
                // Gerar pdf internamente
                axios.post(rotaInterna, querystring.stringify({
                    name: phantomConfig.name,
                    excluir: phantomConfig.excluir || false,
                    tipoPDF: phantomConfig.tipoPDF,
                    html: html
                }))
                .then(response => {
                    out({ret:true});
                })
                .catch( () => res.status(412));
            } else {
                // Retorna html 
                res.send(html);
			}
			
            function out(data) { console.log(data)
            	if(data.ret){ 
					let mailOptions = {
						from: 'notreply.appirrigar@gmail.com',
						to: email,
						subject: 'Relatório de Resultados',
						html: '<p>Segue em anexo seu relatório em PDF.</p> <br> <p>Sua mensagem foi enviada através do APP Irrigar</p>',
						attachments: [{ // Basta incluir esta chave e listar os anexos
							filename: 'relatorio.pdf', // O nome que aparecerá nos anexos
							path: './midias/'+phantomConfig.name+'.pdf' // O arquivo será lido neste local ao ser enviado
						}]
					}; 
					transporter.sendMail(mailOptions, function(error, info){
						console.log(error)
						if (error) { 
							let retorno = {ret:false};
							res.status(200).json(retorno);
						} else {
							res.status(200).json(data);
						}
					});            		
            	}else{ 
	                res.status(200).json(data);
            	}
            }

            res.status(412);
		}
		
		const returnXlsx = (phantomConfig, html) => {
			try{
				let init

				if (jsreportStarted) {
					init = Promise.resolve(jsreport)
				} else {
					jsreportStarted = true
					init = jsreport.init()
				}
				init.then(() => {
					jsreport.render({
						template: {
							content: '<table><tr><td>foo</td></tr></table>',
							engine: 'none',
							recipe: 'html-to-xlsx'
						}
					}).then(function (res) {
						sair({ret:true});
					})
				});
				
			}catch (e){
				res.status(500).json({ret:false});
			}

			function sair(data) {res.status(200).json(data);}
		}

		let html = reportHtml.preview({
			problemas: req.body.data,
			type: req.body.type
		});
		if(req.body.type == "pdf"){
			returnPdf(req.body.phantom, html);
		}else{
			returnXlsx(req.body.phantom, html);
		}
	});
}