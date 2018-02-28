module.exports = app => {
	if(process.env.NODE_ENV !== "test"){		
		app.db.sequelize.sync({force:true}).done(() => {
			app.listen(app.get("port"), () => {
			  console.log(`NTASK API - porta ${app.get("port")}`);
			});
		});
	}
}