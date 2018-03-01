const bodyParser = require("body-parser");
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const logger = require("./logger.js");
const compression = require("compression");
const helmet = require("helmet");

module.exports = app => {
	app.set("port",3000);
	app.set("json spaces", 4);
	app.use(morgan("common", {
		stream: {
			write: (message) => {
				logger.info(message);
			}
		}
	}));
	app.use(helmet());
	app.use(cors({
		origin: ["http://localhost:3001"],
		methods: ["GET","POST","PUT","DELETE"],
		allowedHeaders: ["Content-Type", "Authorization"]
	}));
	app.use(compression());
	app.use(bodyParser.json());
	app.use(app.auth.initialize());
	app.use((req, res, next) => {
		delete req.body.id;
		next();
	});
	app.use(express.static("public"));
};