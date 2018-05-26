const https = require("https");
const fs = require("fs");

module.exports = app => {
	if(process.env.NODE_ENV !== "test"){		
		const credentials = {
			key: fs.readFileSync("ntask.key", "utf8"),
			cert: fs.readFileSync("ntask.cert", "utf8")
		}
		
		//acesso HTTP
		app.db.sequelize.sync({force:false}).done(() => {
			app.listen(app.get("port"), () => {
			  console.log(`NTASK API - porta ${app.get("port")}`);
			});
		});

		//acesso HTTPS
		// app.db.sequelize.sync().done(() => {
		// 	https.createServer(credentials, app)
		// 		.listen(app.get("port"), () => {
		// 		  console.log(`NTASK API - porta ${app.get("port")}`);
		// 		});
		// });
	}
}